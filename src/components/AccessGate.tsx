import {
  FormEvent,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeEmoji } from './NativeEmoji';
import { accessConfig, siteIdentity } from '../data/content';

type AccessGateProps = {
  children: React.ReactNode;
};

type AccessGateContextValue = {
  logout: () => void;
};

const AccessGateContext = createContext<AccessGateContextValue | null>(null);

export function useAccessGate() {
  const context = useContext(AccessGateContext);

  if (!context) {
    throw new Error('useAccessGate must be used within AccessGate.');
  }

  return context;
}

export function AccessGate({ children }: AccessGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = window.sessionStorage.getItem(accessConfig.sessionKey);
    if (saved === 'granted') {
      setIsUnlocked(true);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.trim().toUpperCase() === accessConfig.code.toUpperCase()) {
      window.sessionStorage.setItem(accessConfig.sessionKey, 'granted');
      setError('');
      setIsUnlocked(true);
      return;
    }

    setError('Code incorrect. Essaie encore.');
  }

  function handleLogout() {
    window.sessionStorage.removeItem(accessConfig.sessionKey);
    setCode('');
    setError('');
    setIsUnlocked(false);
  }

  const contextValue = useMemo(
    () => ({
      logout: handleLogout,
    }),
    [],
  );

  if (isUnlocked) {
    return (
      <AccessGateContext.Provider value={contextValue}>{children}</AccessGateContext.Provider>
    );
  }

  return (
    <div className="access-gate-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-noir px-4 py-10">
      <div aria-hidden="true" className="jaguar-backdrop" />
      <div aria-hidden="true" className="jaguar-overlay" />
      <div aria-hidden="true" className="gold-sheen" />
      <div className="absolute left-[8%] top-[18%] h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-[12%] right-[10%] h-72 w-72 rounded-full bg-fauve/25 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
        <section className="glass-card p-8 sm:p-10 lg:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-gold">
            {siteIdentity.badge}
          </p>
          <h1 className="mt-6 flex max-w-3xl items-center gap-3 font-display text-6xl leading-[0.92] text-ivory sm:text-7xl lg:text-8xl">
            <span>{siteIdentity.title}</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-gold/30 bg-noir/50 shadow-gold sm:h-14 sm:w-14 lg:h-16 lg:w-16">
              <NativeEmoji symbol="🐆" label="Jaguar" className="text-2xl sm:text-3xl lg:text-4xl" />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-beige/85 sm:text-xl">
            {siteIdentity.subtitle}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="glass-inset p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Prive</p>
              <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/25 bg-espresso/70 shadow-gold">
                <NativeEmoji symbol="✨" label="Prive" className="text-lg" />
              </span>
              <p className="mt-3 font-display text-3xl text-ivory">Acces filtre</p>
            </div>
            <div className="glass-inset p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Modulable</p>
              <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/25 bg-espresso/70 shadow-gold">
                <NativeEmoji symbol="🐾" label="Empreinte" className="text-lg" />
              </span>
              <p className="mt-3 font-display text-3xl text-ivory">Code editable</p>
            </div>
            <div className="glass-inset p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Premium</p>
              <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/25 bg-espresso/70 shadow-gold">
                <NativeEmoji symbol="🐆" label="Jaguar" className="text-lg" />
              </span>
              <p className="mt-3 font-display text-3xl text-ivory">Experience intime</p>
            </div>
          </div>
        </section>

        <section className="glass-card-strong p-7 sm:p-8">
          <div className="glass-inset p-7">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
              {accessConfig.title}
            </p>
            <h2 className="mt-4 font-display text-4xl text-ivory">Code d entree</h2>
            <p className="mt-4 text-sm leading-7 text-beige/80">{accessConfig.description}</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ivory">Entrer le code</span>
                <input
                  type="password"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    if (error) {
                      setError('');
                    }
                  }}
                  placeholder="Ex: ROSE2026"
                  className="w-full rounded-2xl border border-gold/25 bg-noir/60 px-4 py-4 text-base text-ivory outline-none transition placeholder:text-beige/35 focus:border-gold focus:ring-2 focus:ring-gold/25"
                  aria-label="Code d acces"
                />
              </label>

              <button
                type="submit"
                className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-noir/10">
                  <NativeEmoji symbol="✨" label="Etincelles" className="text-sm" />
                </span>
                Entrer dans le site
              </button>
            </form>

            <div className="mt-5 min-h-6">
              <p className="text-sm font-medium text-beige/60">{accessConfig.hint}</p>
              <p className="mt-2 text-sm font-semibold text-[#e0a184]" aria-live="polite">
                {error}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
