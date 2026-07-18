import { useMemo, useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { SectionTitle } from '../components/SectionTitle';
import { photos } from '../data/photos';

type FilterValue = 'Tous' | (typeof photos)[number]['tag'];

export function GalleryPage() {
  const [filter, setFilter] = useState<FilterValue>('Tous');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filters = useMemo<FilterValue[]>(
    () => ['Tous', ...new Set(photos.map((photo) => photo.tag))],
    [],
  );

  const filteredPhotos = useMemo(
    () => photos.filter((photo) => filter === 'Tous' || photo.tag === filter),
    [filter],
  );

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Galerie"
        title="Nos souvenirs en lumiere"
        description="Les images sont chargees en lazy loading, filtrees par ambiance et s ouvrent en grand dans une lightbox."
      />

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
              filter === item
                ? 'btn-gold'
                : 'btn-outline-gold'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPhotos.map((photo, index) => (
          <button
            key={`${photo.src}-${photo.caption}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="glass-card group animate-fade-up overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{photo.tag}</p>
              <p className="mt-2 font-display text-2xl text-ivory">{photo.caption}</p>
            </div>
          </button>
        ))}
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
