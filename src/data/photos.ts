import { withBaseUrl } from '../utils/withBaseUrl';

export type PhotoTag = 'Voyages' | 'Moments' | 'Sourires';

export type PhotoItem = {
  src: string;
  tag: PhotoTag;
  caption: string;
  alt: string;
};

export const photos: PhotoItem[] = [
  {
    src: withBaseUrl('photos/photo01.jpg'),
    tag: 'Voyages',
    caption: 'Notre premiere escapade a deux',
    alt: 'Souvenir de voyage romantique en rose',
  },
  {
    src: withBaseUrl('photos/photo02.jpg'),
    tag: 'Moments',
    caption: 'Un soir tout simple devenu inoubliable',
    alt: 'Moment tendre capture dans une lumiere douce',
  },
  {
    src: withBaseUrl('photos/photo03.jpg'),
    tag: 'Sourires',
    caption: 'Ton rire qui eclaire tout',
    alt: 'Portrait avec un sourire lumineux',
  },
  {
    src: withBaseUrl('photos/photo04.jpg'),
    tag: 'Voyages',
    caption: 'La route etait encore plus belle avec toi',
    alt: 'Photo de route et de voyage en amoureux',
  },
  {
    src: withBaseUrl('photos/photo05.jpg'),
    tag: 'Moments',
    caption: 'Nos silences qui font du bien',
    alt: 'Instant de calme et de douceur a deux',
  },
  {
    src: withBaseUrl('photos/photo06.jpg'),
    tag: 'Sourires',
    caption: 'Une joie qui ne se force jamais',
    alt: 'Sourire naturel et complice',
  },
  {
    src: withBaseUrl('photos/photo07.jpg'),
    tag: 'Voyages',
    caption: 'Les plus beaux detours portent ton nom',
    alt: 'Scene de voyage au coucher du soleil',
  },
  {
    src: withBaseUrl('photos/photo08.jpg'),
    tag: 'Moments',
    caption: 'Le genre de minute qu on voudrait figer',
    alt: 'Moment partage dans une ambiance romantique',
  },
  {
    src: withBaseUrl('photos/photo09.jpg'),
    tag: 'Sourires',
    caption: 'Ton regard avant meme ton sourire',
    alt: 'Regard tendre et souriant',
  },
  {
    src: withBaseUrl('photos/photo10.jpg'),
    tag: 'Voyages',
    caption: 'Toujours partir quelque part avec toi',
    alt: 'Destination romantique et lumineuse',
  },
  {
    src: withBaseUrl('photos/photo11.jpg'),
    tag: 'Moments',
    caption: 'Les details qui rendent l amour reel',
    alt: 'Petit moment simple du quotidien amoureux',
  },
  {
    src: withBaseUrl('photos/photo12.jpg'),
    tag: 'Sourires',
    caption: 'Mon endroit prefere reste pres de toi',
    alt: 'Grand sourire dans une atmosphere douce',
  },
];
