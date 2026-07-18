const PLAYLIST_ID = '0fUoiw9vhymePS1KHKUyo1';
const embedSrc = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const playlistUrl = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

export function SpotifyPlayer() {
  return (
    <section className="glass-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
            Notre playlist
          </p>
          <p className="mt-1 text-sm leading-6 text-beige/75">
            Nos chansons, directement depuis Spotify.
          </p>
        </div>
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Ouvrir dans Spotify
        </a>
      </div>

      <div className="overflow-hidden rounded-[1.2rem]">
        <iframe
          title="Lecteur Spotify de notre playlist"
          src={embedSrc}
          width="100%"
          height={420}
          style={{ border: 0 }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  );
}
