import { useState } from 'react';
import { ConfettiCanvas } from '../components/ConfettiCanvas';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';

export function SurprisePage() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Surprise"
        title="Un dernier message rien que pour toi"
        description="Une interaction simple, sans librairie externe, avec un petit effet de confettis leger en canvas."
      />

      <section className="glass-card relative mx-auto max-w-4xl overflow-hidden p-8 sm:p-12">
        <ConfettiCanvas active={revealed} />

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-espresso/70 shadow-gold">
            <NativeEmoji symbol="🐆" label="Jaguar" className="text-5xl" />
          </div>

          <h2 className="mt-6 font-display text-4xl text-ivory sm:text-5xl">
            {revealed ? 'Je t aime plus fort chaque jour.' : 'Clique pour reveler'}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-beige/80 sm:text-lg">
            {revealed
              ? 'Merci d etre toi. Que ce site reste une petite capsule de douceur, de souvenirs et d avenir a construire ensemble.'
              : 'Appuie sur le bouton et laisse apparaitre le message final.'}
          </p>

          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
          >
            <NativeEmoji symbol="✨" label="Etincelles" className="text-sm" />
            {revealed ? 'Message revele' : 'Reveler la surprise'}
          </button>
        </div>
      </section>
    </div>
  );
}
