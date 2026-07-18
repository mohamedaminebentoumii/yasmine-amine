import { NativeEmoji } from './NativeEmoji';

export function HeartBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute right-[-6%] top-0 h-[28rem] w-[28rem] rounded-full bg-fauve/25 blur-3xl" />
      <div className="absolute bottom-[-8%] left-[18%] h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute inset-x-0 top-[14%] mx-auto h-px max-w-5xl bg-gold-hairline" />
      <NativeEmoji symbol="🐾" className="absolute right-[10%] top-[28%] text-2xl animate-pulse-soft opacity-15" />
      <NativeEmoji symbol="✨" className="absolute bottom-[20%] right-[16%] text-3xl animate-float opacity-15" />
    </div>
  );
}
