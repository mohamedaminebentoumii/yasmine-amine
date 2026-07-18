import { useEffect } from 'react';
import type { PhotoItem } from '../data/photos';

type LightboxProps = {
  photos: PhotoItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowRight') {
        onNext();
      }
      if (event.key === 'ArrowLeft') {
        onPrevious();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-noir/80 px-4 py-10 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse de la galerie"
      onClick={onClose}
    >
      <div
        className="glass-card-strong relative w-full max-w-4xl p-3 sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-outline-gold absolute right-4 top-4 z-10 rounded-full px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Fermer la photo"
        >
          Fermer
        </button>
        <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-[1.5rem] bg-noir/60">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
              {currentPhoto.tag}
            </p>
            <p className="mt-1 font-display text-2xl text-ivory">{currentPhoto.caption}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="btn-outline-gold rounded-full px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Photo precedente"
            >
              Precedente
            </button>
            <button
              type="button"
              onClick={onNext}
              className="btn-gold rounded-full px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Photo suivante"
            >
              Suivante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
