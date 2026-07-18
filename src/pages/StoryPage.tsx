import { useState } from 'react';
import { ImportantDatesSection } from '../components/ImportantDatesSection';
import { NativeEmoji } from '../components/NativeEmoji';
import { qualities } from '../data/content';
import { timeline } from '../data/timeline';
import { SectionTitle } from '../components/SectionTitle';

export function StoryPage() {
  // 0 = voyage pas encore commence ; sinon nombre de moments reveles.
  const [revealed, setRevealed] = useState(0);

  const total = timeline.length;
  const started = revealed > 0;
  const finished = revealed >= total;

  return (
    <div className="space-y-14">
      <section>
        <SectionTitle
          eyebrow="Notre histoire"
          title="Chaque chapitre compte"
          description="Un voyage a parcourir moment apres moment, pour revivre chaque etape de la facon unique dont votre histoire s est construite."
        />

        {!started ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center animate-fade-up">
            <p className="max-w-md text-base leading-8 text-beige/75">
              Appuie pour ouvrir le premier chapitre, puis laisse chaque moment
              se devoiler l un apres l autre.
            </p>
            <button
              type="button"
              onClick={() => setRevealed(1)}
              className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
            >
              <NativeEmoji symbol="✨" label="Depart" className="text-sm" />
              Commencer le voyage
            </button>
          </div>
        ) : (
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-gold/25 md:block" />
            <div className="space-y-6">
              {timeline.slice(0, revealed).map((step, index) => (
                <article
                  key={step.title}
                  className="glass-card animate-fade-up p-6 md:ml-10"
                >
                  <div className="md:flex md:items-start md:gap-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold-cta text-sm font-bold text-noir shadow-gold md:mb-0 md:-ml-[4.4rem]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">
                        {step.date}
                      </p>
                      <h2 className="mt-2 font-display text-3xl text-ivory">{step.title}</h2>
                      <p className="mt-3 max-w-2xl text-base leading-8 text-beige/80">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80">
                Moment {revealed} / {total}
              </p>

              {!finished ? (
                <button
                  type="button"
                  onClick={() => setRevealed((current) => Math.min(current + 1, total))}
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
                >
                  Moment suivant
                  <NativeEmoji symbol="🐾" label="Suite" className="text-sm" />
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center animate-fade-up">
                  <p className="max-w-md text-base leading-8 text-beige/80">
                    Et l histoire ne fait que commencer.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealed(0)}
                    className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Revivre le voyage
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <ImportantDatesSection />

      <section className="glass-card p-5 sm:p-8">
        <SectionTitle
          eyebrow="Ce que j aime chez toi"
          title="Huit raisons, et ce n est qu un debut"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {qualities.map((quality, index) => (
            <div
              key={quality}
              className="glass-inset animate-fade-up p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">
                0{index + 1}
              </p>
              <p className="mt-2 text-lg leading-8 text-ivory/90">{quality}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
