import { useEffect, useRef, useState } from 'react';
import type { Track } from '../data/playlist';

type MusicPlayerProps = {
  tracks: Track[];
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fallbackMap, setFallbackMap] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [hasStarted, setHasStarted] = useState(false);

  const currentTrack = tracks[currentIndex];
  const isUsingFallback = Boolean(fallbackMap[currentIndex] && currentTrack.fallbackSrc);
  const currentSource = isUsingFallback ? currentTrack.fallbackSrc ?? currentTrack.src : currentTrack.src;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldResumeRef.current) {
      void audio.play();
    }
  }, [currentIndex, currentSource]);

  async function playTrack() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    setHasStarted(true);
    shouldResumeRef.current = true;

    try {
      await audio.play();
    } catch {
      shouldResumeRef.current = false;
      setIsPlaying(false);
    }
  }

  function pauseTrack() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    shouldResumeRef.current = false;
    audio.pause();
  }

  function togglePlayback() {
    if (isPlaying) {
      pauseTrack();
      return;
    }
    void playTrack();
  }

  function handleTrackChange(index: number) {
    shouldResumeRef.current = isPlaying || hasStarted;
    setCurrentIndex(index);
  }

  function handleNext() {
    shouldResumeRef.current = isPlaying || hasStarted;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  }

  function handlePrevious() {
    shouldResumeRef.current = isPlaying || hasStarted;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="glass-card p-8">
        <div
          className={`rounded-[1.75rem] border border-gold/25 bg-gradient-to-br ${currentTrack.accent} p-8 text-ivory shadow-card`}
        >
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-gold-light">Lecture en cours</p>
          <h2 className="mt-4 font-display text-4xl">{currentTrack.title}</h2>
          <p className="mt-2 text-base text-beige/90">{currentTrack.artist}</p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-beige/85">
            Le lecteur n active aucune lecture automatique. Clique sur le bouton ci-dessous
            pour lancer la musique quand tu le souhaites.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light/90">
            {isUsingFallback
              ? 'Mode demo integre actif en attendant vos vrais mp3'
              : 'Lecture depuis public/music'}
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void playTrack()}
              className="btn-gold rounded-full px-5 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
            >
              Lancer la musique
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="btn-outline-gold rounded-full px-5 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              aria-label={isPlaying ? 'Mettre en pause la musique' : 'Lire la musique'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={handlePrevious}
              className="btn-outline-gold rounded-full px-5 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              aria-label="Titre precedent"
            >
              Precedent
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn-outline-gold rounded-full px-5 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              aria-label="Titre suivant"
            >
              Suivant
            </button>
          </div>

          <div className="glass-inset p-5">
            <div className="mb-2 flex justify-between text-sm font-semibold text-beige/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(event) => {
                const audio = audioRef.current;
                const nextTime = Number(event.target.value);
                setCurrentTime(nextTime);
                if (audio) {
                  audio.currentTime = nextTime;
                }
              }}
              className="w-full accent-[#C8A45D]"
              aria-label="Barre de progression du lecteur audio"
            />
          </div>

          <label className="glass-inset p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-ivory">Volume</span>
              <span className="text-sm text-beige/75">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="w-full accent-[#C8A45D]"
              aria-label="Reglage du volume"
            />
          </label>
        </div>

        <audio
          ref={audioRef}
          preload="metadata"
          aria-label="Lecteur audio romantique"
          onError={() => {
            if (!fallbackMap[currentIndex] && currentTrack.fallbackSrc) {
              setFallbackMap((previous) => ({ ...previous, [currentIndex]: true }));
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onEnded={handleNext}
        >
          <source src={currentSource} />
        </audio>
      </section>

      <aside className="glass-card p-6">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-gold">Playlist</p>
        <div className="mt-6 space-y-4">
          {tracks.map((track, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={track.title}
                type="button"
                onClick={() => handleTrackChange(index)}
                className={`w-full rounded-[1.5rem] border p-5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isActive
                    ? 'border-gold/50 bg-fauve/30 shadow-gold'
                    : 'border-gold/15 bg-noir/40 hover:border-gold/40'
                }`}
              >
                <p className="font-display text-2xl text-ivory">{track.title}</p>
                <p className="mt-2 text-sm leading-6 text-beige/75">{track.artist}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  {isActive ? 'Selection en cours' : 'Cliquer pour lire'}
                </p>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
