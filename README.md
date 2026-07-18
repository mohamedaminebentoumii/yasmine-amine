# Pour ma copine

Site romantique front-only construit avec Vite, React, TypeScript et Tailwind CSS. Le projet est optimisé pour fonctionner en local et sur GitHub Pages.

## Prerequis

- Node.js 20+ recommande
- npm 10+
- Un depot GitHub pour le deploiement Pages

## Commandes pour creer le projet

Si vous repartez de zero dans un autre dossier, utilisez ces commandes :

```bash
npm create vite@latest pour-ma-copine -- --template react-ts
cd pour-ma-copine
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
```

Dans ce workspace, les fichiers sont deja en place. Il suffit d'installer les dependances :

```bash
npm install
npm run dev
```

## Lancer en local

```bash
npm install
npm run dev
```

Le site sera disponible sur l'URL affichee par Vite, en general `http://localhost:5173/`.

## Build de production

```bash
npm run build
npm run preview
```

## Ou mettre les photos et musiques

- Remplacez les images dans `public/photos/` en gardant les noms `photo01.jpg` a `photo12.jpg`.
- Remplacez les pistes dans `public/music/` en gardant `love1.mp3` et `love2.mp3`.
- Tant que ces mp3 n ont pas ete remplaces, le lecteur bascule automatiquement sur deux mini melodies integrees pour rester fonctionnel.
- Mettez a jour les contenus dans `src/data/photos.ts`, `src/data/timeline.ts`, `src/data/playlist.ts` et `src/data/content.ts`.

## Code d acces

- Le site affiche un ecran d entree avant d ouvrir le contenu.
- Le code par defaut est `ROSE2026`.
- Pour le changer, modifiez `accessConfig.code` dans `src/data/content.ts`.
- Ce verrou reste cote client, donc il sert a filtrer l acces de facon simple, pas a securiser des donnees sensibles.

## Structure principale

```text
public/
  apple-touch-icon.png
  favicon.ico
  manifest.webmanifest
  icons/
  ios-splash/
  photos/
  music/
src/
  components/
  pages/
  data/
  styles/
  utils/
```

## PWA iPhone

- Le site embarque un `manifest.webmanifest` compatible GitHub Pages.
- Les meta tags iOS sont configures dans `index.html`.
- Les icones iOS sont dans `public/apple-touch-icon.png`, `public/icons/icon-192.png`, `public/icons/icon-512.png` et `public/favicon.ico`.
- Les splash screens iPhone sont dans `public/ios-splash/`.
- Le mode standalone iOS est detecte dans `src/utils/pwa.ts`.
- Une banniere `Ajouter a l ecran d accueil` apparait sur iPhone Safari hors mode standalone.

## Test sur iPhone

1. Ouvrez le site avec Safari sur iPhone.
2. Touchez `Partager`.
3. Choisissez `Sur l ecran d accueil`.
4. Touchez `Ajouter`.
5. Ouvrez l icone depuis l ecran d accueil.

Attendu :

- ouverture en plein ecran
- plus de barre Safari classique
- couleurs du theme rose conservees
- splash screen iPhone
- comportement `standalone`

## Deploiement sur GitHub Pages

Le projet utilise GitHub Actions et `HashRouter`, ce qui evite les problemes de 404 sur GitHub Pages.

1. Creez un depot GitHub et poussez le contenu du projet.
2. Verifiez que le fichier `.github/workflows/deploy.yml` est present.
3. Sur GitHub, ouvrez `Settings > Pages`.
4. Dans `Build and deployment`, choisissez `Source: GitHub Actions`.
5. Poussez sur la branche `main`.
6. Attendez la fin du workflow `Deploy romantic site to GitHub Pages`.
7. Ouvrez l'URL publiee par GitHub Pages.

La configuration `vite.config.ts` detecte automatiquement le nom du depot dans GitHub Actions et applique le bon `base path`.

## Personnalisation rapide

- Texte d'accueil : `src/pages/HomePage.tsx`
- Timeline et liste des qualites : `src/data/timeline.ts` et `src/data/content.ts`
- Galerie : `src/data/photos.ts`
- Playlist : `src/data/playlist.ts`
- Lettre : `src/data/content.ts`
- Couleurs et typographies : `tailwind.config.js` et `src/styles/index.css`
