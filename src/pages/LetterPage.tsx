import { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { romanticLetter } from '../data/content';

export function LetterPage() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(romanticLetter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Lettre"
        title="Quelques mots pour toi"
        description="Une lettre plus intime, ecrite pour Yasmine et pour tout ce que votre histoire fait naitre de beau."
      />

      <section className="glass-card mx-auto max-w-4xl p-8 sm:p-10">
        <div className="glass-inset p-8">
          <pre className="whitespace-pre-wrap font-body text-lg leading-9 text-ivory/90">
            {romanticLetter}
          </pre>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="btn-gold rounded-full px-5 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
          >
            Copier la lettre
          </button>
          <span className="text-sm font-semibold text-beige/75" aria-live="polite">
            {copied ? 'Lettre copiee dans le presse-papiers.' : 'Clique pour copier le texte.'}
          </span>
        </div>
      </section>
    </div>
  );
}
