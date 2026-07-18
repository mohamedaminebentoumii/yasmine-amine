import { useMemo, type CSSProperties } from 'react';
import { NativeEmoji } from './NativeEmoji';

type HeartRainOverlayProps = {
  burstIds: number[];
};

type HeartParticle = {
  left: string;
  delay: string;
  duration: string;
  fontSize: string;
  driftStart: string;
  driftMid: string;
  driftEnd: string;
  opacity: number;
  symbol: string;
};

function createHeartParticles(burstId: number): HeartParticle[] {
  return Array.from({ length: 12 }, (_, index) => {
    const seed = burstId * 97 + index * 31;
    const left = 4 + ((seed * 13) % 92);
    const delay = ((seed % 4) * 0.06).toFixed(2);
    const duration = (3.2 + ((seed % 6) * 0.14)).toFixed(2);
    const size = 22 + ((seed * 5) % 16);
    const driftStartValue = -8 + ((seed * 3) % 16);
    const driftMidValue = -26 + ((seed * 7) % 52);
    const driftEndValue = -18 + ((seed * 11) % 36);
    const opacity = 0.45 + ((seed % 5) * 0.1);

    return {
      left: `${left}%`,
      delay: `${delay}s`,
      duration: `${duration}s`,
      fontSize: `${size}px`,
      driftStart: `${driftStartValue}px`,
      driftMid: `${driftMidValue}px`,
      driftEnd: `${driftEndValue}px`,
      opacity,
      symbol:
        index % 11 === 0 ? '🐆' : index % 3 === 0 ? '✨' : '🐾',
    };
  });
}

function HeartBurst({ burstId }: { burstId: number }) {
  const particles = useMemo(() => createHeartParticles(burstId), [burstId]);

  return (
    <>
      {particles.map((particle, index) => (
        <NativeEmoji
          key={`${burstId}-${index}`}
          symbol={particle.symbol}
          className="heart-rain-particle"
          style={
            {
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              fontSize: particle.fontSize,
              opacity: particle.opacity,
              '--heart-drift-start': particle.driftStart,
              '--heart-drift-mid': particle.driftMid,
              '--heart-drift-end': particle.driftEnd,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

export function HeartRainOverlay({ burstIds }: HeartRainOverlayProps) {
  if (burstIds.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {burstIds.map((burstId) => (
        <HeartBurst key={burstId} burstId={burstId} />
      ))}
    </div>
  );
}
