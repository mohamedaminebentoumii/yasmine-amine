import { SectionTitle } from '../components/SectionTitle';
import { SpotifyPlayer } from '../components/SpotifyPlayer';

export function MusicPage() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Musique"
        title="Une bande-son pour nous"
        description="Notre playlist, directement depuis Spotify."
      />

      <SpotifyPlayer />
    </div>
  );
}
