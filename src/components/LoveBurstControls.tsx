import { NativeEmoji } from './NativeEmoji';

type LoveBurstControlsProps = {
  onTrigger: () => void;
};

const controls = [
  { side: 'left', mobile: 'left-4', desktop: 'lg:left-6' },
  { side: 'right', mobile: 'right-4', desktop: 'lg:right-6' },
] as const;

export function LoveBurstControls({ onTrigger }: LoveBurstControlsProps) {
  return (
    <>
      {controls.map((control) => (
        <button
          key={control.side}
          type="button"
          onClick={onTrigger}
          className={`floating-safe fixed bottom-5 ${control.mobile} ${control.desktop} z-[95] flex items-center gap-2 rounded-full border border-gold/30 bg-espresso/70 px-3 py-2.5 text-sm font-semibold text-beige shadow-luxe backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir`}
          aria-label="Faire apparaitre des empreintes dorees sur le site"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-noir/60 shadow-gold">
            <NativeEmoji symbol="🐾" label="Empreinte" className="text-base" />
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-noir/60 shadow-gold">
            <NativeEmoji symbol="✨" label="Etincelles" className="text-base" />
          </span>
        </button>
      ))}
    </>
  );
}
