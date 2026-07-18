import { photos } from '../data/photos';
import { withBaseUrl } from '../utils/withBaseUrl';

const fallbackPhoto = photos[0];
const preferredPhoto = withBaseUrl('photos/yasmine.jpg');

export function HeroPhoneMockup() {
  return (
    <div className="relative z-10 flex justify-center animate-fade-up lg:-translate-y-4 xl:-translate-y-6 [animation-delay:120ms]">
      <div className="relative w-full max-w-[280px] sm:max-w-[295px] lg:max-w-[320px]">
        <div className="absolute inset-x-10 top-5 h-16 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute inset-x-12 bottom-3 h-20 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative rounded-[3.65rem] bg-[linear-gradient(145deg,#6d4a26_0%,#241610_20%,#8a5c2e_38%,#1a110b_58%,#5a3a22_78%,#171009_100%)] p-[9px] shadow-[0_38px_95px_rgba(0,0,0,0.55)]">
          <div className="pointer-events-none absolute inset-[1px] rounded-[3.6rem] border border-gold/40 opacity-80" />
          <div className="absolute -left-[2px] top-[5.25rem] h-7 w-[4px] rounded-full bg-[linear-gradient(180deg,#8a5c2e,#e8d3a3)] opacity-95" />
          <div className="absolute -left-[2px] top-[7.7rem] h-12 w-[4px] rounded-full bg-[linear-gradient(180deg,#8a5c2e,#e8d3a3)] opacity-95" />
          <div className="absolute -left-[2px] top-[11rem] h-12 w-[4px] rounded-full bg-[linear-gradient(180deg,#8a5c2e,#e8d3a3)] opacity-95" />
          <div className="absolute -right-[2px] top-[8.7rem] h-16 w-[4px] rounded-full bg-[linear-gradient(180deg,#8a5c2e,#e8d3a3)] opacity-95" />

          <div className="relative overflow-hidden rounded-[3.05rem] bg-[#0b0705] p-[7px] shadow-[0_24px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(232,211,163,0.35),inset_0_0_0_1px_rgba(200,164,93,0.18)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
              <div className="h-[1.8rem] w-[7rem] rounded-full bg-black shadow-[0_8px_18px_rgba(0,0,0,0.4)]" />
            </div>

            <div className="jaguar-texture relative aspect-[9/19.5] overflow-hidden rounded-[2.65rem]">
              <img
                src={preferredPhoto}
                alt="Photo de Yasmine dans un mockup iPhone"
                className="h-full w-full object-cover object-center"
                loading="eager"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackPhoto.src;
                }}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.06),rgba(17,17,17,0.03)_35%,rgba(17,17,17,0.4)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-[26%] bg-[linear-gradient(180deg,rgba(248,245,238,0.14),transparent)]" />

              <div className="absolute bottom-2.5 left-1/2 h-[4px] w-[7.2rem] -translate-x-1/2 rounded-full bg-ivory/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
