import { useEffect, useMemo, useState } from 'react';
import { personalization } from '../data/content';

type ElapsedParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRelationshipStartDate() {
  return new Date(
    personalization.relationshipStart.year,
    personalization.relationshipStart.month - 1,
    personalization.relationshipStart.day,
    0,
    0,
    0,
    0,
  );
}

function getElapsedParts(startDate: Date): ElapsedParts {
  const now = new Date();
  const diff = Math.max(now.getTime() - startDate.getTime(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function RelationshipCounter() {
  const startDate = useMemo(() => getRelationshipStartDate(), []);
  const [elapsed, setElapsed] = useState(() => getElapsedParts(startDate));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsed(getElapsedParts(startDate));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [startDate]);

  return (
    <section className="glass-card p-7">
      <div className="glass-inset p-7">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">
          Notre jour
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-ivory">
          Depuis qu on s est mis ensemble
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-beige/75">
          Depuis le {personalization.relationshipStart.label}, votre histoire continue
          d ecrire ses jours, ses heures et tout ce qu elle a deja construit.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: elapsed.days, label: 'jours' },
            { value: elapsed.hours, label: 'heures' },
            { value: elapsed.minutes, label: 'minutes' },
            { value: elapsed.seconds, label: 'secondes' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.6rem] border border-gold/20 bg-noir/45 p-5 text-center shadow-card"
            >
              <p className="font-display text-5xl text-gold-light">
                {item.value.toString().padStart(2, '0')}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-beige/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
