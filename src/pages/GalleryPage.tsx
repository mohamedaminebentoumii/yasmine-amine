import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';
import { photos, type PhotoItem } from '../data/photos';
import {
  compressImage,
  loadStoredPhotos,
  removeStoredPhoto,
  requestPersistentStorage,
  saveStoredPhoto,
} from '../utils/localGallery';

type FilterValue = 'Tous' | PhotoItem['tag'];

type LocalPhoto = PhotoItem & { localId: number };

const localTag = 'Mes photos' as const;

export function GalleryPage() {
  const [filter, setFilter] = useState<FilterValue>('Tous');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [storageError, setStorageError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    loadStoredPhotos()
      .then((stored) => {
        if (cancelled) {
          return;
        }

        const mapped = stored.map((photo) => {
          const url = URL.createObjectURL(photo.blob);
          objectUrlsRef.current.push(url);
          return {
            src: url,
            tag: localTag,
            caption: 'Notre souvenir',
            alt: `Photo ajoutee : ${photo.name}`,
            localId: photo.id,
          };
        });
        setLocalPhotos(mapped);
      })
      .catch(() => {
        // Stockage local indisponible : la galerie de base reste fonctionnelle.
      });

    return () => {
      cancelled = true;
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setIsImporting(true);
    setStorageError('');

    try {
      await requestPersistentStorage();

      const added: LocalPhoto[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const blob = await compressImage(file);
        const name = file.name.replace(/\.[^.]+$/, '') || 'souvenir';
        const id = await saveStoredPhoto(blob, name);
        const url = URL.createObjectURL(blob);
        objectUrlsRef.current.push(url);
        added.push({
          src: url,
          tag: localTag,
          caption: 'Notre souvenir',
          alt: `Photo ajoutee : ${file.name}`,
          localId: id,
        });
      }

      setLocalPhotos((previous) => [...added, ...previous]);
      setFilter('Tous');
      setSelectedIndex(null);
    } catch {
      setStorageError(
        'Impossible d enregistrer sur cet appareil. Reessaie hors navigation privee.',
      );
    } finally {
      setIsImporting(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  async function handleDelete(photo: LocalPhoto) {
    try {
      await removeStoredPhoto(photo.localId);
    } catch {
      // La photo disparait au moins de l affichage courant.
    }

    URL.revokeObjectURL(photo.src);
    objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== photo.src);
    setLocalPhotos((previous) =>
      previous.filter((item) => item.localId !== photo.localId),
    );
    setSelectedIndex(null);
  }

  const allPhotos = useMemo<PhotoItem[]>(
    () => [...localPhotos, ...photos],
    [localPhotos],
  );

  const filters = useMemo<FilterValue[]>(() => {
    const base: FilterValue[] = ['Tous', ...new Set(photos.map((photo) => photo.tag))];
    if (localPhotos.length > 0) {
      base.splice(1, 0, localTag);
    }
    return base;
  }, [localPhotos]);

  const filteredPhotos = useMemo(
    () => allPhotos.filter((photo) => filter === 'Tous' || photo.tag === filter),
    [allPhotos, filter],
  );

  function findLocalPhoto(photo: PhotoItem): LocalPhoto | undefined {
    return localPhotos.find((item) => item.src === photo.src);
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Galerie"
        title="Nos souvenirs en lumiere"
        description="Ajoute vos photos directement depuis le telephone : elles restent enregistrees sur cet appareil et reapparaissent a chaque visite."
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
          {isImporting ? 'Ajout en cours…' : 'Ajouter des photos'}
        </button>
        {storageError ? (
          <p className="text-sm font-semibold text-[#e0a184]" aria-live="polite">
            {storageError}
          </p>
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
          const localPhoto = findLocalPhoto(photo);

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

              {localPhoto ? (
                <button
                  type="button"
                  onClick={() => void handleDelete(localPhoto)}
                  className="btn-outline-gold absolute right-3 top-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Supprimer cette photo ajoutee"
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
