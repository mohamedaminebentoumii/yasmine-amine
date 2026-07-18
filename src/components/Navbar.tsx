import { NavLink, useNavigate } from 'react-router-dom';
import { useAccessGate } from './AccessGate';
import { NativeEmoji } from './NativeEmoji';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/histoire', label: 'Notre histoire' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/jeu', label: 'Jeu' },
  { to: '/musique', label: 'Musique' },
  { to: '/lettre', label: 'Lettre' },
  { to: '/surprise', label: 'Surprise' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAccessGate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="app-navbar sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 rounded-luxe border border-gold/25 bg-espresso/55 px-4 py-4 shadow-luxe backdrop-blur-xl sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <NavLink to="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-ivory">
          <span>Pour toi</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 bg-noir/60 shadow-gold">
            <NativeEmoji symbol="🐆" label="Jaguar" className="text-sm" />
          </span>
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                  isActive
                    ? 'bg-gold-cta text-noir shadow-gold'
                    : 'text-beige/80 hover:bg-ivory/5 hover:text-gold-light'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="btn-outline-gold hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold md:inline-flex"
          >
            Se deconnecter
          </button>

          <NavLink
            to="/surprise"
            className="btn-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-noir/10">
              <NativeEmoji symbol="✨" label="Etincelles" className="text-xs" />
            </span>
            Surprise
          </NavLink>
        </div>
      </nav>

      <div className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-4 pb-2 pt-3 md:hidden sm:px-6 lg:px-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                isActive
                  ? 'bg-gold-cta text-noir shadow-gold'
                  : 'border border-gold/20 bg-espresso/60 text-beige/80 backdrop-blur'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="whitespace-nowrap rounded-full border border-gold/20 bg-espresso/60 px-4 py-2 text-sm font-semibold text-beige/80 backdrop-blur"
        >
          Se deconnecter
        </button>
      </div>
    </header>
  );
}
