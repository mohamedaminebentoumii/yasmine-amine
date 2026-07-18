import { importantDates } from '../data/importantDates';

export function ImportantDatesSection() {
  return (
    <section className="glass-card p-5 sm:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <span
            aria-hidden="true"
            className="h-px w-8 bg-gradient-to-r from-transparent via-gold/50 to-gold sm:w-14"
          />
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold sm:text-sm">
            Nos dates importantes
          </p>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-gradient-to-l from-transparent via-gold/50 to-gold sm:w-14"
          />
        </div>
        <h2 className="title-luxe font-display text-4xl font-semibold italic leading-[1.08] sm:text-5xl">
          Les jours qu on n oublie pas
        </h2>
        <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
        </div>
        <p className="mt-5 text-base leading-8 text-beige/80 sm:text-lg">
          Une section dediee aux jours qui ont fait grandir votre histoire et qui
          meritaient un espace a eux seuls.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {importantDates.map((item, index) => (
          <article
            key={`${item.date}-${item.title}`}
            className="glass-inset animate-fade-up p-6"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                  {item.label}
                </p>
                <h3 className="mt-3 font-display text-3xl text-ivory">{item.title}</h3>
              </div>
              <div className="rounded-2xl bg-gold-cta px-3 py-2 text-center text-noir shadow-gold">
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Date</p>
                <p className="mt-1 text-sm font-semibold">{item.date}</p>
              </div>
            </div>

            <p className="mt-5 text-base leading-8 text-beige/80">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
