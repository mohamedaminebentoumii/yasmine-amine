import { useEffect, useMemo, useState } from 'react';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';

type HeartTarget = {
  id: number;
  left: string;
  top: string;
  size: number;
  points: number;
  symbol: string;
  glowClassName: string;
};

const gameDuration = 30;
const bestScoreStorageKey = 'romantic-game-best-score';

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTarget(id: number): HeartTarget {
  const isBonus = id % 5 === 0;

  return {
    id,
    left: `${randomBetween(10, 76)}%`,
    top: `${randomBetween(12, 72)}%`,
    size: isBonus ? 72 : randomBetween(56, 66),
    points: isBonus ? 3 : 1,
    symbol: isBonus ? '🐆' : id % 3 === 0 ? '✨' : '🐾',
    glowClassName: isBonus
      ? 'shadow-[0_18px_34px_rgba(200,164,93,0.4)]'
      : 'shadow-[0_18px_34px_rgba(200,164,93,0.22)]',
  };
}

function getResultMessage(score: number) {
  if (score >= 26) {
    return 'Tu attrapes mon coeur beaucoup trop facilement.';
  }

  if (score >= 18) {
    return 'Clairement, mon coeur finit toujours chez toi.';
  }

  if (score >= 10) {
    return 'Tu vois, meme en jeu je reviens toujours vers toi.';
  }

  return 'Encore une partie, mon coeur veut se faire attraper.';
}

export function GamePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [targetId, setTargetId] = useState(1);
  const [target, setTarget] = useState<HeartTarget>(() => createTarget(1));

  useEffect(() => {
    const savedBestScore = Number(window.localStorage.getItem(bestScoreStorageKey) ?? 0);
    if (Number.isFinite(savedBestScore) && savedBestScore > 0) {
      setBestScore(savedBestScore);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTargetId((current) => current + 1);
    }, 950);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning, target.id]);

  useEffect(() => {
    setTarget(createTarget(targetId));
  }, [targetId]);

  useEffect(() => {
    if (score <= bestScore) {
      return;
    }

    setBestScore(score);
    window.localStorage.setItem(bestScoreStorageKey, String(score));
  }, [bestScore, score]);

  const progressWidth = useMemo(
    () => `${Math.max((timeLeft / gameDuration) * 100, 0)}%`,
    [timeLeft],
  );

  function startGame() {
    setScore(0);
    setTimeLeft(gameDuration);
    setTargetId(1);
    setTarget(createTarget(1));
    setIsRunning(true);
  }

  function handleCatchHeart() {
    if (!isRunning) {
      return;
    }

    setScore((current) => current + target.points);
    setTargetId((current) => current + 1);
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Jeu"
        title="Attrape mon coeur"
        description="Trente secondes, des empreintes qui bougent, et juste une regle : attrape le plus possible avant la fin."
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Regles</p>
            <h2 className="mt-4 font-display text-4xl text-ivory">Mini-game feline</h2>
            <p className="mt-4 text-base leading-8 text-beige/80">
              Clique sur les empreintes avant qu elles ne changent de place. Le jaguar
              vaut plus de points.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startGame}
                className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              >
                <NativeEmoji symbol="🐾" label="Jouer" className="text-sm" />
                {isRunning ? 'Recommencer' : 'Lancer la partie'}
              </button>
              <div className="glass-inset inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-beige">
                30 secondes
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Score</p>
              <p className="mt-3 font-display text-5xl text-gold-light">{score}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Temps</p>
              <p className="mt-3 font-display text-5xl text-gold-light">{timeLeft}s</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Record</p>
              <p className="mt-3 font-display text-5xl text-gold-light">{bestScore}</p>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Message</p>
            <p className="mt-3 text-base leading-8 text-beige/80">{getResultMessage(score)}</p>
          </div>
        </div>

        <div className="glass-card-strong p-4">
          <div className="glass-inset p-4">
            <div className="mb-4 h-3 overflow-hidden rounded-full bg-ivory/10">
              <div
                className="h-full rounded-full bg-gold-cta transition-[width] duration-700"
                style={{ width: progressWidth }}
              />
            </div>

            <div className="relative min-h-[360px] sm:min-h-[440px] overflow-hidden rounded-[1.7rem] border border-gold/15 bg-[radial-gradient(circle_at_top,rgba(90,58,34,0.5),rgba(17,17,17,0.72)_70%)]">
              <div className="absolute left-[8%] top-[14%] h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
              <div className="absolute right-[10%] top-[24%] h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
              <div className="absolute bottom-[10%] left-[18%] h-28 w-28 rounded-full bg-fauve/30 blur-2xl" />

              {!isRunning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-espresso/80 shadow-gold">
                    <NativeEmoji symbol="🐆" label="Jaguar" className="text-5xl" />
                  </div>
                  <p className="mt-6 font-display text-5xl text-ivory">Pret ?</p>
                  <p className="mt-4 max-w-md text-base leading-8 text-beige/80">
                    Lance la partie et attrape les empreintes avant qu elles ne disparaissent.
                  </p>
                </div>
              ) : (
                <button
                  key={target.id}
                  type="button"
                  onClick={handleCatchHeart}
                  className={`absolute flex items-center justify-center rounded-full border border-gold/30 bg-espresso/80 backdrop-blur transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${target.glowClassName}`}
                  style={{
                    left: target.left,
                    top: target.top,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`Attraper l empreinte pour ${target.points} point${target.points > 1 ? 's' : ''}`}
                >
                  <NativeEmoji
                    symbol={target.symbol}
                    label="Cible"
                    className={target.points > 1 ? 'text-4xl' : 'text-3xl'}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
