import { withBaseUrl } from '../utils/withBaseUrl';
import { createPlaceholderAudio } from '../utils/createPlaceholderAudio';

export type Track = {
  title: string;
  artist: string;
  src: string;
  fallbackSrc?: string;
  accent: string;
};

export const playlist: Track[] = [
  {
    title: 'Love 1',
    artist: 'Piste placeholder a remplacer',
    src: withBaseUrl('music/love1.mp3'),
    fallbackSrc: createPlaceholderAudio([261.63, 329.63, 392.0, 523.25]),
    accent: 'from-[#8A5C2E] to-[#2B1D17]',
  },
  {
    title: 'Love 2',
    artist: 'Deuxieme piste placeholder',
    src: withBaseUrl('music/love2.mp3'),
    fallbackSrc: createPlaceholderAudio([220.0, 293.66, 349.23, 440.0]),
    accent: 'from-[#5A3A22] to-[#171009]',
  },
];
