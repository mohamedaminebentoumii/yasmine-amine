import { MusicPlayer } from '../components/MusicPlayer';
import { SectionTitle } from '../components/SectionTitle';
import { playlist } from '../data/playlist';

export function MusicPage() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Musique"
        title="Une bande-son pour nous"
        description="Deux titres placeholder sont inclus pour valider le lecteur. Remplace-les ensuite par vos vraies chansons dans le dossier public."
      />
      <MusicPlayer tracks={playlist} />
    </div>
  );
}
