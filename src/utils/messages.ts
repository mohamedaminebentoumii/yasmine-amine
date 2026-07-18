/* Espace de messages partage : stocke dans la table Supabase "messages",
   visible et synchronise entre vos deux telephones. */

const SUPABASE_URL = 'https://brevlqvwvfblppisbaxw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZXZscXZ3dmZibHBwaXNiYXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzE1NDMsImV4cCI6MjA5OTk0NzU0M30.WtCLGTI-BHMjFW0M6uaKVRTUQWeG22XF18m5TCfMaGc';

const authHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

export type Message = {
  id: number;
  auteur: string;
  texte: string;
  cree_le: string;
};

export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/messages?select=*&order=cree_le.asc`,
    { headers: authHeaders },
  );

  if (!response.ok) {
    throw new Error(`Messages indisponibles (${response.status})`);
  }

  return (await response.json()) as Message[];
}

export async function addMessage(auteur: string, texte: string): Promise<Message> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ auteur, texte }),
  });

  if (!response.ok) {
    throw new Error(`Message non envoye (${response.status})`);
  }

  const rows = (await response.json()) as Message[];
  return rows[0];
}

export async function deleteMessage(id: number): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });

  if (!response.ok) {
    throw new Error(`Suppression refusee (${response.status})`);
  }
}
