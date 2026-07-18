import { MusicPlayer } from '../components/MusicPlayer';
import { SectionTitle } from '../components/SectionTitle';
import { SpotifyPlayer } from '../components/SpotifyPlayer';
import { playlist } from '../data/playlist';

export function MusicPage() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Musique"
        title="Une bande-son pour nous"
        description="Notre playlist Spotify, et un petit lecteur integre pour vos fichiers personnels."
      />

      <SpotifyPlayer />

      <MusicPlayer tracks={playlist} />
    </div>
  );
}
