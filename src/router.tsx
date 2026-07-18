import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GalleryPage } from './pages/GalleryPage';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { LetterPage } from './pages/LetterPage';
import { MessagesPage } from './pages/MessagesPage';
import { MusicPage } from './pages/MusicPage';
import { StoryPage } from './pages/StoryPage';
import { SurprisePage } from './pages/SurprisePage';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/histoire" element={<StoryPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/jeu" element={<GamePage />} />
          <Route path="/musique" element={<MusicPage />} />
          <Route path="/lettre" element={<LetterPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/surprise" element={<SurprisePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
