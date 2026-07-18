import { personalization } from '../data/content';

export function OriginMapCard() {
  return (
    <section className="glass-card p-7">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-inset p-7">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">Memoire</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ivory">
            {personalization.originStory.title}
          </h2>
          <p className="mt-4 font-display text-3xl text-gold-light">
            {personalization.originStory.place}
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-beige/60">
            {personalization.originStory.coordinates}
          </p>
          <p className="mt-5 text-sm leading-7 text-beige/80">
            {personalization.originStory.description}
          </p>
          <p className="mt-5 rounded-2xl border border-gold/15 bg-noir/40 px-4 py-3 text-sm leading-7 text-beige/80 shadow-card">
            {personalization.originStory.note}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.9rem] border border-gold/20 bg-noir/50 p-5 shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,93,0.14),transparent_36%),linear-gradient(135deg,rgba(43,29,23,0.85),rgba(17,17,17,0.9))]" />
          <div className="relative h-full min-h-[360px] overflow-hidden rounded-[1.5rem] border border-gold/15 bg-espresso/60">
            <svg
              viewBox="0 0 600 420"
              className="h-full w-full"
              aria-label="Carte decorative du lieu ou tout a commence"
              role="img"
            >
              <defs>
                <linearGradient id="roadGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(232,211,163,0.5)" />
                  <stop offset="100%" stopColor="rgba(232,211,163,0.22)" />
                </linearGradient>
                <linearGradient id="riverTone" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(200,164,93,0.28)" />
                  <stop offset="100%" stopColor="rgba(166,124,59,0.32)" />
                </linearGradient>
              </defs>

              <rect width="600" height="420" fill="rgba(26,17,11,0.9)" />
              <path
                d="M0 88C96 118 172 106 240 82C305 59 394 52 600 102V0H0Z"
                fill="rgba(90,58,34,0.4)"
              />
              <path
                d="M0 420H600V304C514 282 429 290 352 314C259 343 155 350 0 318Z"
                fill="rgba(67,41,20,0.55)"
              />
              <path
                d="M0 244C112 214 208 212 286 236C372 261 470 262 600 216"
                fill="none"
                stroke="url(#riverTone)"
                strokeWidth="36"
                strokeLinecap="round"
              />
              <path
                d="M-10 164C114 118 208 122 310 160C393 190 473 195 610 126"
                fill="none"
                stroke="rgba(232,211,163,0.35)"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M-10 164C114 118 208 122 310 160C393 190 473 195 610 126"
                fill="none"
                stroke="rgba(17,17,17,0.5)"
                strokeWidth="3"
                strokeDasharray="10 12"
                strokeLinecap="round"
              />
              <path
                d="M38 352C152 300 254 287 344 300C436 314 512 300 580 254"
                fill="none"
                stroke="url(#roadGlow)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M38 352C152 300 254 287 344 300C436 314 512 300 580 254"
                fill="none"
                stroke="rgba(17,17,17,0.5)"
                strokeWidth="2.5"
                strokeDasharray="8 12"
                strokeLinecap="round"
              />
              <path
                d="M136 44L136 388M242 44L242 388M348 44L348 388M454 44L454 388"
                fill="none"
                stroke="rgba(232,211,163,0.07)"
                strokeWidth="2"
              />
              <path
                d="M44 88L556 88M44 176L556 176M44 264L556 264M44 352L556 352"
                fill="none"
                stroke="rgba(232,211,163,0.07)"
                strokeWidth="2"
              />
              <rect
                x="84"
                y="104"
                width="86"
                height="58"
                rx="16"
                fill="rgba(43,29,23,0.85)"
                stroke="rgba(200,164,93,0.3)"
              />
              <rect
                x="418"
                y="88"
                width="96"
                height="62"
                rx="18"
                fill="rgba(43,29,23,0.8)"
                stroke="rgba(200,164,93,0.3)"
              />
              <rect
                x="386"
                y="286"
                width="124"
                height="70"
                rx="18"
                fill="rgba(43,29,23,0.8)"
                stroke="rgba(200,164,93,0.3)"
              />
              <circle cx="314" cy="196" r="72" fill="rgba(200,164,93,0.08)" />
              <circle cx="314" cy="196" r="50" fill="rgba(200,164,93,0.14)" />
              <circle cx="126" cy="126" r="9" fill="#C8A45D" />
              <circle cx="456" cy="318" r="9" fill="#C8A45D" />
              <path
                d="M314 138C285 138 261 160 261 189C261 231 314 281 314 281C314 281 367 231 367 189C367 160 343 138 314 138Z"
                fill="#C8A45D"
              />
              <circle cx="314" cy="188" r="18" fill="#F8F5EE" />
              <path
                d="M206 206C235 204 259 189 278 164"
                fill="none"
                stroke="rgba(200,164,93,0.45)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="7 10"
              />
              <path
                d="M350 224C388 236 430 252 470 298"
                fill="none"
                stroke="rgba(200,164,93,0.4)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="7 10"
              />
              <text x="102" y="138" fill="rgba(232,211,163,0.75)" fontSize="13" fontFamily="Manrope, sans-serif">
                Paris
              </text>
              <text x="438" y="124" fill="rgba(232,211,163,0.75)" fontSize="13" fontFamily="Manrope, sans-serif">
                Ta story
              </text>
              <text x="404" y="326" fill="rgba(232,211,163,0.75)" fontSize="13" fontFamily="Manrope, sans-serif">
                Maroc et ta famille
              </text>
            </svg>
            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="rounded-2xl border border-gold/25 bg-espresso/85 px-4 py-3 shadow-card backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Repere</p>
                <p className="mt-1 font-display text-2xl text-ivory">
                  {personalization.originStory.place}
                </p>
              </div>
              <div className="rounded-2xl border border-gold/15 bg-noir/70 px-4 py-3 text-sm leading-6 text-beige/80 shadow-card backdrop-blur">
                Un debut a distance, son arrivee le mardi 24 fevrier 2026, puis votre moment le jeudi 26 fevrier 2026.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
