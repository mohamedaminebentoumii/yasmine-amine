type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-4">
        <span
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-r from-transparent via-gold/50 to-gold sm:w-14"
        />
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold sm:text-sm">
          {eyebrow}
        </p>
        <span
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-l from-transparent via-gold/50 to-gold sm:w-14"
        />
      </div>

      <h1 className="title-luxe font-display text-[2.6rem] font-semibold italic leading-[1.08] sm:text-6xl">
        {title}
      </h1>

      <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
      </div>

      {description ? (
        <p className="mt-5 text-base leading-8 text-beige/80 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
