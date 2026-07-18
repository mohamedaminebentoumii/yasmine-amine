import { useEffect, useMemo, useState } from 'react';
import { personalization } from '../data/content';

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetDate: Date;
};

function getNextBirthday(month: number, day: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const candidate = new Date(currentYear, month - 1, day, 0, 0, 0, 0);

  if (candidate.getTime() >= now.getTime()) {
    return candidate;
  }

  return new Date(currentYear + 1, month - 1, day, 0, 0, 0, 0);
}

function getCountdownParts(targetDate: Date): CountdownParts {
  const now = new Date();
  const diff = Math.max(targetDate.getTime() - now.getTime(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    targetDate,
  };
}

export function BirthdayCountdown() {
  const targetDate = useMemo(
    () =>
      getNextBirthday(
        personalization.birthday.month,
        personalization.birthday.day,
      ),
    [],
  );

  const [countdown, setCountdown] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownParts(targetDate));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  const year = countdown.targetDate.getFullYear();

  return (
    <section className="glass-card p-7">
      <div className="glass-inset p-7">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">
          Anniversaire
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-ivory">
          Compte a rebours jusqu au {personalization.birthday.label} {year}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-beige/75">
          Un petit rappel tendre pour attendre le prochain 27 avril.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: countdown.days, label: 'jours' },
            { value: countdown.hours, label: 'heures' },
            { value: countdown.minutes, label: 'minutes' },
            { value: countdown.seconds, label: 'secondes' },
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
