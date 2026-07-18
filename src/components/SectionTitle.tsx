type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-gold">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl font-semibold text-ivory sm:text-5xl">{title}</h1>
      {description ? (
        <p className="mt-4 text-base leading-8 text-beige/80 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
