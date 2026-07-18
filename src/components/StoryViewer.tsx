import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { PhotoItem } from '../data/photos';

type StoryViewerProps = {
  photos: PhotoItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onDelete?: () => void;
};

/* Visionneuse plein ecran facon story Instagram : tap a droite pour
   avancer, tap a gauche pour reculer, aucun texte a l ecran. */
export function StoryViewer({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  onDelete,
}: StoryViewerProps) {
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

  /* Bloque le defilement de la page tant que la story est ouverte. */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /* Rendu en portail directement dans <body> : aucun parent ne peut
     decaler le plein ecran (bugs iOS avec position fixed imbrique). */
  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-[#080605]"
      role="dialog"
      aria-modal="true"
      aria-label="Highlight"
    >
      <div
        className="flex gap-1 px-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        {photos.map((photo, index) => (
          <span
            key={`${photo.src}-${index}`}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              index <= currentIndex ? 'bg-gold' : 'bg-ivory/20'
            }`}
          />
        ))}
      </div>

      <div className="relative flex-1">
        <img
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          className="absolute inset-0 h-full w-full object-contain"
        />

        <button
          type="button"
          onClick={onPrevious}
          className="absolute inset-y-0 left-0 z-10 w-1/3 focus-visible:outline-none"
          aria-label="Photo precedente"
        />
        <button
          type="button"
          onClick={onNext}
          className="absolute inset-y-0 right-0 z-10 w-2/3 focus-visible:outline-none"
          aria-label="Photo suivante"
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-noir/60 text-sm text-beige backdrop-blur transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 28px)' }}
        aria-label="Fermer le highlight"
      >
        ✕
      </button>

      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="absolute left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-noir/60 text-beige/70 backdrop-blur transition hover:text-[#e0a184] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
          aria-label="Supprimer cette photo du highlight"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M4 7h16" />
            <path d="M10 11v6M14 11v6" />
            <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      ) : null}
    </div>,
    document.body,
  );
}
