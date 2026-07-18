import { useState } from 'react';
import { personalization } from '../data/content';

export function ComfortButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="glass-card p-7">
      <div className="glass-inset p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">
              Reassurance
            </p>
            <h2 className="mt-3 font-display text-4xl text-ivory">
              Un bouton a ouvrir dans les jours plus lourds
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="btn-gold rounded-full px-6 py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
          >
            {personalization.comfort.buttonLabel}
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ${
            isOpen ? 'mt-6 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-[1.7rem] border border-gold/20 bg-noir/45 p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
                {personalization.comfort.title}
              </p>
              <p className="mt-4 text-base leading-8 text-beige/85">
                {personalization.comfort.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
