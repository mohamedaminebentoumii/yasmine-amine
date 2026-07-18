import { useState } from 'react';
import { NativeEmoji } from './NativeEmoji';

type IosInstallPromptProps = {
  visible: boolean;
};

export function IosInstallPrompt({ visible }: IosInstallPromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!visible) {
    return null;
  }

  return (
    <div className="install-safe fixed bottom-5 left-1/2 z-[88] w-[min(92vw,420px)] -translate-x-1/2">
      <div className="glass-card-strong p-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="glass-inset flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-ivory transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-espresso/80 shadow-gold">
              <NativeEmoji symbol="🐆" label="Application" className="text-lg" />
            </span>
            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.28em] text-gold">
                iPhone
              </span>
              <span className="mt-1 block text-base font-semibold">
                Ajouter a l ecran d accueil
              </span>
            </span>
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-noir/60 shadow-gold">
            <NativeEmoji symbol="✨" label="Etincelles" className="text-sm" />
          </span>
        </button>

        {isOpen ? (
          <div className="glass-inset mt-3 p-4">
            <div className="flex items-center gap-2 text-gold">
              <NativeEmoji symbol="🐾" label="Empreinte" className="text-sm" />
              <p className="text-sm font-semibold text-ivory">
                Pour l installer comme une app iPhone :
              </p>
            </div>
            <ol className="mt-3 space-y-2 text-sm leading-7 text-beige/80">
              <li>1. Ouvre ce site dans Safari sur iPhone.</li>
              <li>2. Appuie sur le bouton Partager.</li>
              <li>3. Choisis “Sur l ecran d accueil”.</li>
              <li>4. Confirme avec “Ajouter”.</li>
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
}
