import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
};

type ConfettiCanvasProps = {
  active: boolean;
};

const palette = ['#C8A45D', '#E8D3A3', '#F8F5EE', '#8A5C2E'];

export function ConfettiCanvas({ active }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = bounds.width * dpr;
    canvas.height = bounds.height * dpr;
    context.scale(dpr, dpr);

    const particles: Particle[] = Array.from({ length: 90 }, (_, index) => ({
      x: bounds.width / 2 + (index % 10) * 8 - 40,
      y: bounds.height * 0.2,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * -4 - 2,
      size: Math.random() * 8 + 5,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: palette[index % palette.length],
      life: 1,
    }));

    let frameId = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 16.67;
      lastTime = time;
      context.clearRect(0, 0, bounds.width, bounds.height);

      particles.forEach((particle) => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vy += 0.18 * delta;
        particle.rotation += particle.spin * delta;
        particle.life -= 0.012 * delta;

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = Math.max(particle.life, 0);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        context.restore();
      });

      if (particles.some((particle) => particle.life > 0)) {
        frameId = window.requestAnimationFrame(render);
      } else {
        context.clearRect(0, 0, bounds.width, bounds.height);
      }
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      context.clearRect(0, 0, bounds.width, bounds.height);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
