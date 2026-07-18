import { ImportantDatesSection } from '../components/ImportantDatesSection';
import { qualities } from '../data/content';
import { timeline } from '../data/timeline';
import { SectionTitle } from '../components/SectionTitle';

export function StoryPage() {
  return (
    <div className="space-y-14">
      <section>
        <SectionTitle
          eyebrow="Notre histoire"
          title="Chaque chapitre compte"
          description="Une timeline plus sensible, pensee pour raconter Yasmine, vos souvenirs et la facon unique dont votre histoire s est construite."
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-gold/25 md:block" />
          <div className="space-y-6">
            {timeline.map((step, index) => (
              <article
                key={step.title}
                className="glass-card animate-fade-up p-6 md:ml-10"
                style={{ animationDelay: `${index * 90}ms` }}
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
        </div>
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
