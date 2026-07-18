import { BirthdayCountdown } from '../components/BirthdayCountdown';
import { ComfortButton } from '../components/ComfortButton';
import { HeroPhoneMockup } from '../components/HeroPhoneMockup';
import { NativeEmoji } from '../components/NativeEmoji';
import { OriginMapCard } from '../components/OriginMapCard';
import { RelationshipCounter } from '../components/RelationshipCounter';
import { Link } from 'react-router-dom';
import {
  homeHighlights,
  homeMetrics,
  personalization,
  siteIdentity,
} from '../data/content';

export function HomePage() {
  return (
    <div className="grid gap-12">
      <section className="grid min-h-[78vh] items-center gap-8 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        <div className="animate-fade-up">
          <p className="inline-flex rounded-full border border-gold/30 bg-espresso/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.38em] text-gold shadow-card backdrop-blur">
            {siteIdentity.badge}
          </p>
          <p className="mt-6 bg-gold-cta bg-clip-text font-display text-6xl leading-none text-transparent sm:text-8xl lg:text-[7.5rem]">
            {personalization.nickname}
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.35em] text-gold">
            {personalization.nicknameLabel}
          </p>
          <h1 className="mt-7 flex max-w-4xl items-center gap-3 font-display text-[4rem] font-semibold leading-[0.9] text-ivory sm:text-[5.4rem]">
            <span>{siteIdentity.title}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-gold/30 bg-noir/50 shadow-gold sm:h-11 sm:w-11">
              <NativeEmoji symbol="🐆" label="Jaguar" className="text-xl sm:text-2xl" />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-beige/85 sm:text-xl">
            {siteIdentity.subtitle}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-beige/70">
            Plus moderne, plus raffine et plus flexible : chaque section peut etre
            personnalisee sans toucher a la structure du site.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/histoire"
              className="btn-gold rounded-full px-7 py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
            >
              Decouvrir
            </Link>
            <Link
              to="/lettre"
              className="btn-outline-gold rounded-full px-7 py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
            >
              Lire la lettre
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {homeMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="glass-card animate-fade-up p-5"
                style={{ animationDelay: `${index * 90 + 160}ms` }}
              >
                <p className="font-display text-4xl text-gold-light">{metric.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-beige/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <HeroPhoneMockup />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {homeHighlights.map((item, index) => (
          <Link
            key={item.title}
            to={item.to}
            className="glass-card animate-fade-up p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            style={{ animationDelay: `${index * 120 + 160}ms` }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-gold">Section</p>
            <h2 className="mt-4 font-display text-4xl text-ivory">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-beige/80">{item.description}</p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-gold-light">
              Ouvrir la section
            </p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <RelationshipCounter />
        <BirthdayCountdown />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <OriginMapCard />
        <ComfortButton />
      </div>
    </div>
  );
}
