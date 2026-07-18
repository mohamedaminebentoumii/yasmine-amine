import { NativeEmoji } from './NativeEmoji';

export function Footer() {
  return (
    <footer className="app-footer border-t border-gold/15 bg-noir/50 py-8 text-center text-sm text-beige/70 backdrop-blur">
      <span className="inline-flex items-center gap-2">
        Fait avec amour.
        <NativeEmoji symbol="🐾" label="Empreinte" className="text-xs opacity-60" />
      </span>
    </footer>
  );
}
