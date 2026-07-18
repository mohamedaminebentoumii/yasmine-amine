import { importantDates } from '../data/importantDates';

export function ImportantDatesSection() {
  return (
    <section className="glass-card p-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-gold">
          Nos dates importantes
        </p>
        <h2 className="font-display text-4xl font-semibold text-ivory sm:text-5xl">
          Les jours qu on n oublie pas
        </h2>
        <p className="mt-4 text-base leading-8 text-beige/80 sm:text-lg">
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
