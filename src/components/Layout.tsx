import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AccessGate } from './AccessGate';
import { Footer } from './Footer';
import { HeartBackdrop } from './HeartBackdrop';
import { HeartRainOverlay } from './HeartRainOverlay';
import { IosInstallPrompt } from './IosInstallPrompt';
import { LoveBurstControls } from './LoveBurstControls';
import { Navbar } from './Navbar';
import { isIosSafari, isStandaloneMode } from '../utils/pwa';

export function Layout() {
  const location = useLocation();
  const burstCounterRef = useRef(0);
  const burstTimeoutsRef = useRef<number[]>([]);
  const lastBurstAtRef = useRef(0);
  const [activeBursts, setActiveBursts] = useState<number[]>([]);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    function syncDisplayMode() {
      const iosSafari = isIosSafari();
      const standalone = isStandaloneMode();

      setIsStandalone(standalone);
      setShowInstallPrompt(iosSafari && !standalone);

      document.body.classList.toggle('app-standalone', standalone);
      document.body.classList.toggle('ios-standalone', iosSafari && standalone);
      document.body.classList.toggle('ios-browser', iosSafari && !standalone);
    }

    syncDisplayMode();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const onChange = () => syncDisplayMode();

    mediaQuery.addEventListener?.('change', onChange);
    window.addEventListener('pageshow', onChange);

    return () => {
      mediaQuery.removeEventListener?.('change', onChange);
      window.removeEventListener('pageshow', onChange);
      document.body.classList.remove('app-standalone', 'ios-standalone', 'ios-browser');
    };
  }, []);

  useEffect(() => {
    return () => {
      burstTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      burstTimeoutsRef.current = [];
    };
  }, []);

  function handleLoveBurst() {
    const now = window.performance.now();

    // Avoid accidental double-fire on fast taps while keeping repeated clicks responsive.
    if (now - lastBurstAtRef.current < 220) {
      return;
    }

    lastBurstAtRef.current = now;
    burstCounterRef.current += 1;
    const nextBurstId = burstCounterRef.current;

    setActiveBursts((current) => [...current, nextBurstId]);

    const timeoutId = window.setTimeout(() => {
      setActiveBursts((current) => current.filter((burstId) => burstId !== nextBurstId));
      burstTimeoutsRef.current = burstTimeoutsRef.current.filter(
        (activeTimeoutId) => activeTimeoutId !== timeoutId,
      );
    }, 3800);

    burstTimeoutsRef.current.push(timeoutId);
  }

  return (
    <AccessGate>
      <div className="app-shell relative min-h-screen overflow-hidden bg-noir">
        <div aria-hidden="true" className="jaguar-backdrop" />
        <div aria-hidden="true" className="jaguar-overlay" />
        <div aria-hidden="true" className="gold-sheen" />
        <HeartBackdrop />
        <HeartRainOverlay burstIds={activeBursts} />
        <IosInstallPrompt visible={showInstallPrompt} />
        <LoveBurstControls onTrigger={handleLoveBurst} />
        <div className="relative z-10 min-h-screen">
          <Navbar />
          <main className="app-main mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </AccessGate>
  );
}
