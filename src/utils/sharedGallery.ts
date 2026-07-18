/* Galerie partagée : les photos sont stockées dans Supabase Storage
   (bucket public "galerie") et visibles depuis tous les appareils. */

const SUPABASE_URL = 'https://brevlqvwvfblppisbaxw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZXZscXZ3dmZibHBwaXNiYXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzE1NDMsImV4cCI6MjA5OTk0NzU0M30.WtCLGTI-BHMjFW0M6uaKVRTUQWeG22XF18m5TCfMaGc';
const BUCKET = 'galerie';

const authHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

export type SharedPhoto = {
  /* Chemin complet dans le bucket, ex. "Vacances/171234-ab.jpg". */
  name: string;
  url: string;
  createdAt: string;
  /* Nom du highlight (dossier), ou null pour la galerie generale. */
  folder: string | null;
};

function publicUrl(name: string): string {
  const encoded = name.split('/').map(encodeURIComponent).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

type StorageEntry = {
  name: string;
  id: string | null;
  created_at: string;
};

async function listPrefix(prefix: string): Promise<StorageEntry[]> {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prefix,
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Liste indisponible (${response.status})`);
  }

  return (await response.json()) as StorageEntry[];
}

/* Liste la galerie generale (racine) et chaque highlight (dossier). */
export async function listSharedPhotos(): Promise<SharedPhoto[]> {
  const root = await listPrefix('');

  const photos: SharedPhoto[] = root
    .filter((item) => Boolean(item.id))
    .map((item) => ({
      name: item.name,
      url: publicUrl(item.name),
      createdAt: item.created_at,
      folder: null,
    }));

  const folders = root.filter((item) => !item.id).map((item) => item.name);

  const folderListings = await Promise.all(
    folders.map(async (folder) => {
      const items = await listPrefix(folder);
      return items
        .filter((item) => Boolean(item.id))
        .map((item) => ({
          name: `${folder}/${item.name}`,
          url: publicUrl(`${folder}/${item.name}`),
          createdAt: item.created_at,
          folder,
        }));
    }),
  );

  for (const listing of folderListings) {
    photos.push(...listing);
  }

  return photos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function uploadSharedPhoto(
  blob: Blob,
  folder: string | null = null,
): Promise<SharedPhoto> {
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const name = folder ? `${folder}/${fileName}` : fileName;
  const encoded = name.split('/').map(encodeURIComponent).join('/');

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encoded}`,
    {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'image/jpeg' },
      body: blob,
    },
  );

  if (!response.ok) {
    throw new Error(`Envoi refuse (${response.status})`);
  }

  return {
    name,
    url: publicUrl(name),
    createdAt: new Date().toISOString(),
    folder,
  };
}

/* Legendes : stockees dans la table photos_partagees (Data API).
   Chaque fonction echoue en silence cote appelant si la table
   n existe pas encore — la galerie reste fonctionnelle sans legendes. */

export async function fetchCaptions(): Promise<Record<string, string>> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/photos_partagees?select=nom_fichier,legende`,
    { headers: authHeaders },
  );

  if (!response.ok) {
    throw new Error(`Legendes indisponibles (${response.status})`);
  }

  const rows = (await response.json()) as Array<{
    nom_fichier: string;
    legende: string | null;
  }>;

  const captions: Record<string, string> = {};
  for (const row of rows) {
    if (row.legende) {
      captions[row.nom_fichier] = row.legende;
    }
  }
  return captions;
}

export async function saveCaption(name: string, caption: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/photos_partagees`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ nom_fichier: name, legende: caption }),
  });

  if (!response.ok) {
    throw new Error(`Legende non enregistree (${response.status})`);
  }
}

export async function deleteCaption(name: string): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/photos_partagees?nom_fichier=eq.${encodeURIComponent(name)}`,
    { method: 'DELETE', headers: authHeaders },
  );
}

export async function deleteSharedPhoto(name: string): Promise<void> {
  const encoded = name.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encoded}`,
    {
      method: 'DELETE',
      headers: authHeaders,
    },
  );

  if (!response.ok) {
    throw new Error(`Suppression refusee (${response.status})`);
  }
}

/* Recompresse la photo (max 1600px, JPEG 85%) avant l envoi pour
   economiser le stockage et accelerer le chargement. */
export async function compressImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Image illisible'));
      element.src = url;
    });

    const maxSide = 1600;
    const scale = Math.min(
      1,
      maxSide / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    );

    return blob ?? file;
  } finally {
    URL.revokeObjectURL(url);
  }
}
