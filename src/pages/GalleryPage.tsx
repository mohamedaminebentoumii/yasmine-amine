import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';
import { photos, type PhotoItem } from '../data/photos';
import {
  compressImage,
  deleteSharedPhoto,
  listSharedPhotos,
  uploadSharedPhoto,
  type SharedPhoto,
} from '../utils/sharedGallery';

type FilterValue = 'Tous' | PhotoItem['tag'];

type SharedGalleryItem = PhotoItem & { sharedName: string };

const sharedTag = 'Mes photos' as const;

function toGalleryItem(photo: SharedPhoto): SharedGalleryItem {
  return {
    src: photo.url,
    tag: sharedTag,
    caption: 'Notre souvenir',
    alt: 'Photo ajoutee dans notre galerie partagee',
    sharedName: photo.name,
  };
}

export function GalleryPage() {
  const [filter, setFilter] = useState<FilterValue>('Tous');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sharedPhotos, setSharedPhotos] = useState<SharedGalleryItem[]>([]);
  const [isLoadingShared, setIsLoadingShared] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    listSharedPhotos()
      .then((stored) => {
        if (!cancelled) {
          setSharedPhotos(stored.map(toGalleryItem));
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

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setIsImporting(true);
    setStatusMessage('');

    try {
      const added: SharedGalleryItem[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const blob = await compressImage(file);
        const stored = await uploadSharedPhoto(blob);
        added.push(toGalleryItem(stored));
      }

      setSharedPhotos((previous) => [...added, ...previous]);
      setFilter('Tous');
      setSelectedIndex(null);
      if (added.length > 0) {
        setStatusMessage(
          added.length === 1
            ? 'Photo ajoutee : elle est maintenant visible sur vos deux telephones.'
            : `${added.length} photos ajoutees : elles sont maintenant visibles sur vos deux telephones.`,
        );
      }
    } catch {
      setStatusMessage("L envoi a echoue. Verifie ta connexion et reessaie.");
    } finally {
      setIsImporting(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
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
      setSharedPhotos((previous) =>
        previous.filter((item) => item.sharedName !== photo.sharedName),
      );
      setSelectedIndex(null);
    } catch {
      setStatusMessage('La suppression a echoue. Reessaie dans un instant.');
    }
  }

  const allPhotos = useMemo<PhotoItem[]>(
    () => [...sharedPhotos, ...photos],
    [sharedPhotos],
  );

  const filters = useMemo<FilterValue[]>(() => {
    const base: FilterValue[] = ['Tous', ...new Set(photos.map((photo) => photo.tag))];
    if (sharedPhotos.length > 0) {
      base.splice(1, 0, sharedTag);
    }
    return base;
  }, [sharedPhotos]);

  const filteredPhotos = useMemo(
    () => allPhotos.filter((photo) => filter === 'Tous' || photo.tag === filter),
    [allPhotos, filter],
  );

  function findSharedPhoto(photo: PhotoItem): SharedGalleryItem | undefined {
    return sharedPhotos.find((item) => item.src === photo.src);
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Galerie"
        title="Nos souvenirs en lumiere"
        description="Ajoutez vos photos depuis n importe quel telephone : elles sont enregistrees dans votre galerie partagee et visibles par vous deux."
      />

      <div className="flex flex-col items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <button
          type="button"
          disabled={isImporting}
          onClick={() => inputRef.current?.click()}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
        >
          <NativeEmoji symbol="✨" label="Ajouter" className="text-sm" />
          {isImporting ? 'Envoi en cours…' : 'Ajouter des photos'}
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

      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFilter(item);
              setSelectedIndex(null);
            }}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              filter === item ? 'btn-gold' : 'btn-outline-gold'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPhotos.map((photo, index) => {
          const sharedPhoto = findSharedPhoto(photo);

          return (
            <div key={`${photo.src}-${photo.caption}`} className="relative">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="glass-card group block w-full animate-fade-up overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                    {photo.tag}
                  </p>
                  <p className="mt-2 font-display text-2xl text-ivory">{photo.caption}</p>
                </div>
              </button>

              {sharedPhoto ? (
                <button
                  type="button"
                  onClick={() => void handleDelete(sharedPhoto)}
                  className="btn-outline-gold absolute right-3 top-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Supprimer cette photo partagee"
                >
                  Supprimer
                </button>
              ) : null}
            </div>
          );
        })}
      </section>

      {selectedIndex !== null ? (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length)}
          onPrevious={() =>
            setSelectedIndex(
              (prev) => ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length,
            )
          }
        />
      ) : null}
    </div>
  );
}
