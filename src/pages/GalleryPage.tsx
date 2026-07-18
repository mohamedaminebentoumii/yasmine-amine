import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';
import { photos, type PhotoItem } from '../data/photos';
import {
  compressImage,
  deleteCaption,
  deleteSharedPhoto,
  fetchCaptions,
  listSharedPhotos,
  saveCaption,
  uploadSharedPhoto,
} from '../utils/sharedGallery';

type SharedGalleryItem = PhotoItem & { sharedName: string; folder: string | null };

type Highlight = {
  name: string;
  cover: string;
  photos: SharedGalleryItem[];
};

const defaultCaption = 'Notre souvenir';
const rootDestination = '__galerie__';
const newDestination = '__nouveau__';

function sanitizeHighlightName(value: string): string {
  return value.trim().replace(/[/\\#?%]/g, '').slice(0, 24);
}

export function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [storyHighlight, setStoryHighlight] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [sharedPhotos, setSharedPhotos] = useState<SharedGalleryItem[]>([]);
  const [isLoadingShared, setIsLoadingShared] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreview, setPendingPreview] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [destination, setDestination] = useState(rootDestination);
  const [newHighlightName, setNewHighlightName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      listSharedPhotos(),
      fetchCaptions().catch(() => ({}) as Record<string, string>),
    ])
      .then(([stored, captions]) => {
        if (!cancelled) {
          setSharedPhotos(
            stored.map((photo) => ({
              src: photo.url,
              tag: 'Mes photos' as const,
              caption: captions[photo.name] || defaultCaption,
              alt: 'Photo ajoutee dans notre galerie partagee',
              sharedName: photo.name,
              folder: photo.folder,
            })),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatusMessage(
            'Galerie partagee momentanement indisponible. Verifie ta connexion.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingShared(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview);
      }
    };
  }, [pendingPreview]);

  const highlights = useMemo<Highlight[]>(() => {
    const groups = new Map<string, SharedGalleryItem[]>();
    for (const photo of sharedPhotos) {
      if (!photo.folder) {
        continue;
      }
      const group = groups.get(photo.folder) ?? [];
      group.push(photo);
      groups.set(photo.folder, group);
    }

    return [...groups.entries()].map(([name, items]) => ({
      name,
      cover: items[0].src,
      photos: items,
    }));
  }, [sharedPhotos]);

  const allPhotos = useMemo<PhotoItem[]>(
    () => [...sharedPhotos, ...photos],
    [sharedPhotos],
  );

  const storyPhotos = useMemo<PhotoItem[]>(() => {
    if (!storyHighlight) {
      return [];
    }
    return highlights.find((highlight) => highlight.name === storyHighlight)?.photos ?? [];
  }, [highlights, storyHighlight]);

  function handleFiles(files: FileList | null) {
    const images = Array.from(files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (images.length === 0) {
      return;
    }

    setStatusMessage('');
    setCaptionText('');
    setDestination(rootDestination);
    setNewHighlightName('');
    setPendingFiles(images);
    setPendingPreview(URL.createObjectURL(images[0]));
  }

  function closeComposer() {
    setPendingFiles([]);
    setPendingPreview('');
    setCaptionText('');
    setDestination(rootDestination);
    setNewHighlightName('');
  }

  async function handleShare() {
    if (pendingFiles.length === 0) {
      return;
    }

    setIsImporting(true);
    setStatusMessage('');
    const caption = captionText.trim();

    let folder: string | null = null;
    if (destination === newDestination) {
      folder = sanitizeHighlightName(newHighlightName) || null;
    } else if (destination !== rootDestination) {
      folder = destination;
    }

    try {
      const added: SharedGalleryItem[] = [];
      for (const file of pendingFiles) {
        const blob = await compressImage(file);
        const stored = await uploadSharedPhoto(blob, folder);
        if (caption) {
          await saveCaption(stored.name, caption).catch(() => {
            // Legende non enregistree : la photo reste partagee.
          });
        }
        added.push({
          src: stored.url,
          tag: 'Mes photos' as const,
          caption: caption || defaultCaption,
          alt: 'Photo ajoutee dans notre galerie partagee',
          sharedName: stored.name,
          folder: stored.folder,
        });
      }

      setSharedPhotos((previous) => [...added, ...previous]);
      setSelectedIndex(null);
      closeComposer();
      setStatusMessage(
        added.length === 1
          ? 'Photo partagee : elle est maintenant visible sur vos deux telephones.'
          : `${added.length} photos partagees : elles sont maintenant visibles sur vos deux telephones.`,
      );
    } catch {
      setStatusMessage("L envoi a echoue. Verifie ta connexion et reessaie.");
    } finally {
      setIsImporting(false);
    }
  }

  async function handleDelete(photo: SharedGalleryItem) {
    const confirmed = window.confirm(
      'Supprimer cette photo pour vous deux ? Elle disparaitra de tous les appareils.',
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteSharedPhoto(photo.sharedName);
      await deleteCaption(photo.sharedName);
      setSharedPhotos((previous) =>
        previous.filter((item) => item.sharedName !== photo.sharedName),
      );
      setSelectedIndex(null);
      setStoryHighlight(null);
    } catch {
      setStatusMessage('La suppression a echoue. Reessaie dans un instant.');
    }
  }

  function findSharedPhoto(photo: PhotoItem): SharedGalleryItem | undefined {
    return sharedPhotos.find((item) => item.src === photo.src);
  }

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Galerie" title="Nos souvenirs en lumiere" />

      <div className="flex flex-col items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <button
          type="button"
          disabled={isImporting}
          onClick={() => inputRef.current?.click()}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
        >
          <NativeEmoji symbol="✨" label="Ajouter" className="text-sm" />
          Ajouter des photos
        </button>
        {statusMessage ? (
          <p
            className="max-w-md text-center text-sm font-semibold text-beige/80"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}
        {isLoadingShared ? (
          <p className="text-sm text-beige/60">Chargement de vos photos partagees…</p>
        ) : null}
      </div>

      {/* Highlights facon Instagram */}
      <div className="flex gap-5 overflow-x-auto px-1 pb-1 sm:justify-center">
        {highlights.map((highlight) => (
          <button
            key={highlight.name}
            type="button"
            onClick={() => {
              setStoryIndex(0);
              setStoryHighlight(highlight.name);
            }}
            className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5 focus-visible:outline-none"
          >
            <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-deep p-[2.5px] shadow-gold transition duration-300 hover:shadow-gold-glow">
              <span className="h-full w-full overflow-hidden rounded-full border-2 border-noir">
                <img
                  src={highlight.cover}
                  alt={`Highlight ${highlight.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </span>
            </span>
            <span className="w-full truncate text-center text-xs font-semibold text-beige/85">
              {highlight.name}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5 focus-visible:outline-none"
          aria-label="Creer un highlight"
        >
          <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-dashed border-gold/50 bg-espresso/50 text-2xl font-light text-gold transition duration-300 hover:shadow-gold-glow">
            +
          </span>
          <span className="w-full truncate text-center text-xs font-semibold text-beige/60">
            Nouveau
          </span>
        </button>
      </div>

      <section className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {allPhotos.map((photo, index) => {
          const sharedPhoto = findSharedPhoto(photo);

          return (
            <div key={`${photo.src}-${photo.caption}`} className="relative">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group block w-full animate-fade-up overflow-hidden rounded-[10px] border border-gold/15 bg-espresso/60 transition duration-300 hover:shadow-gold-glow sm:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </button>

              {sharedPhoto ? (
                <button
                  type="button"
                  onClick={() => void handleDelete(sharedPhoto)}
                  className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 bg-noir/70 text-xs font-semibold text-beige backdrop-blur transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Supprimer cette photo partagee"
                >
                  ✕
                </button>
              ) : null}
            </div>
          );
        })}
      </section>

      {pendingFiles.length > 0 ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-noir/80 px-4 py-8 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Nouvelle publication"
          onClick={isImporting ? undefined : closeComposer}
        >
          <div
            className="glass-card-strong w-full max-w-md p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-gold">
              Nouvelle publication
            </p>

            <div className="relative mt-4 flex max-h-[36vh] items-center justify-center overflow-hidden rounded-[1.2rem] bg-noir/60">
              <img
                src={pendingPreview}
                alt="Apercu de la photo a partager"
                className="max-h-[36vh] w-auto max-w-full object-contain"
              />
              {pendingFiles.length > 1 ? (
                <span className="absolute right-2 top-2 rounded-full border border-gold/30 bg-noir/75 px-2.5 py-1 text-xs font-semibold text-beige backdrop-blur">
                  +{pendingFiles.length - 1}
                </span>
              ) : null}
            </div>

            <label className="mt-4 block">
              <span className="sr-only">Legende</span>
              <textarea
                value={captionText}
                onChange={(event) => setCaptionText(event.target.value.slice(0, 220))}
                placeholder="Ecris une legende…"
                rows={2}
                className="w-full resize-none rounded-[1.2rem] border border-gold/20 bg-noir/60 px-4 py-3 text-[17px] leading-6 text-ivory outline-none transition placeholder:text-beige/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
            </label>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gold/90">
              Highlight
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDestination(rootDestination)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  destination === rootDestination ? 'btn-gold' : 'btn-outline-gold'
                }`}
              >
                Galerie
              </button>
              {highlights.map((highlight) => (
                <button
                  key={highlight.name}
                  type="button"
                  onClick={() => setDestination(highlight.name)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    destination === highlight.name ? 'btn-gold' : 'btn-outline-gold'
                  }`}
                >
                  {highlight.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDestination(newDestination)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  destination === newDestination ? 'btn-gold' : 'btn-outline-gold'
                }`}
              >
                + Nouveau
              </button>
            </div>

            {destination === newDestination ? (
              <input
                type="text"
                value={newHighlightName}
                onChange={(event) => setNewHighlightName(event.target.value)}
                placeholder="Nom du highlight (ex. Vacances)"
                maxLength={24}
                className="mt-3 w-full rounded-[1.2rem] border border-gold/20 bg-noir/60 px-4 py-3 text-[17px] text-ivory outline-none transition placeholder:text-beige/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
            ) : null}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={isImporting}
                onClick={closeComposer}
                className="btn-outline-gold flex-1 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isImporting}
                onClick={() => void handleShare()}
                className="btn-gold flex-1 rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              >
                {isImporting ? 'Envoi…' : 'Partager'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {storyHighlight && storyPhotos.length > 0 ? (
        <Lightbox
          photos={storyPhotos}
          currentIndex={Math.min(storyIndex, storyPhotos.length - 1)}
          onClose={() => setStoryHighlight(null)}
          onNext={() => setStoryIndex((prev) => (prev + 1) % storyPhotos.length)}
          onPrevious={() =>
            setStoryIndex((prev) => (prev - 1 + storyPhotos.length) % storyPhotos.length)
          }
        />
      ) : null}

      {selectedIndex !== null ? (
        <Lightbox
          photos={allPhotos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((prev) => ((prev ?? 0) + 1) % allPhotos.length)}
          onPrevious={() =>
            setSelectedIndex(
              (prev) => ((prev ?? 0) - 1 + allPhotos.length) % allPhotos.length,
            )
          }
        />
      ) : null}
    </div>
  );
}
