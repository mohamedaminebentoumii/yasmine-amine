import {
  FormEvent,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeEmoji } from './NativeEmoji';
import { accessConfig } from '../data/content';

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

const particles = [
  { left: '12%', size: 4, delay: '0s', duration: '11s' },
  { left: '24%', size: 3, delay: '2.4s', duration: '13s' },
  { left: '38%', size: 5, delay: '1.1s', duration: '10s' },
  { left: '50%', size: 3, delay: '4.2s', duration: '14s' },
  { left: '61%', size: 4, delay: '0.6s', duration: '12s' },
  { left: '72%', size: 3, delay: '3.3s', duration: '15s' },
  { left: '83%', size: 5, delay: '1.8s', duration: '11.5s' },
  { left: '91%', size: 3, delay: '5.1s', duration: '13.5s' },
  { left: '7%', size: 3, delay: '6s', duration: '12.5s' },
];

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
    <div className="access-gate-shell gate-root">
      <div className="gate-bg" aria-hidden="true" />
      <div className="gate-light" aria-hidden="true" />
      <div className="gate-vignette" aria-hidden="true" />
      <div className="gate-particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <main className="gate-content">
        <div className="gate-logo">
          <NativeEmoji symbol="🐆" label="Jaguar" />
        </div>

        <div className="gate-line" aria-hidden="true" />

        <h1 className="gate-title">Pour toi.</h1>
        <p className="gate-subtitle">Un univers créé uniquement pour toi.</p>

        <form className="gate-card" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="gate-code">
            Code d acces
          </label>
          <input
            id="gate-code"
            type="password"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) {
                setError('');
              }
            }}
            placeholder="Code secret"
            autoComplete="off"
            className={`gate-input${error ? ' gate-shake' : ''}`}
          />

          <button type="submit" className="gate-button">
            Entrer
          </button>

          <p className="gate-error" aria-live="polite">
            {error}
          </p>
          <p className="gate-hint">{accessConfig.hint}</p>
        </form>
      </main>
    </div>
  );
}
