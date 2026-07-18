export type ImportantDate = {
  date: string;
  title: string;
  detail: string;
  label: string;
};

export const importantDates: ImportantDate[] = [
  {
    date: 'Le jour de ta story',
    title: 'Je t ai repondu',
    detail: 'Le tout premier geste de cette histoire : une reponse a ta story qui a change la suite.',
    label: 'Premier contact',
  },
  {
    date: '3 mois',
    title: 'Une distance precieuse',
    detail: 'Trois mois a distance, avec un lien qui a grandi en intensite, en patience et en valeur.',
    label: 'Distance',
  },
  {
    date: 'Jeudi 26 fevrier 2026',
    title: 'On s est captes',
    detail: 'Le moment ou cette histoire nee a distance a pris une presence encore plus forte et plus reelle.',
    label: 'Moment a deux',
  },
];
