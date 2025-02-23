export enum Genres {
  Drama = 'drama',
  History = 'history',
  Adventure = 'adventure',
  Action = 'action',
  NonFiction = 'non fiction',
  Comedy = 'comedy',
  Crime = 'crime',
  Fantasy = 'fantasy',
  Mystery = 'mystery',
  Horror = 'horror',
  Thriller = 'thriller',
  All = 'all',
}

export type Genre =
  | 'drama'
  | 'history'
  | 'adventure'
  | 'action'
  | 'non fiction'
  | 'comedy'
  | 'crime'
  | 'fantasy'
  | 'mystery'
  | 'horror'
  | 'thriller'
  | 'all';

export type sortValues = {
  text: string;
  value: string;
};
export const genres: Genre[] = [
  Genres.Drama,
  Genres.History,
  Genres.Adventure,
  Genres.Action,
  Genres.NonFiction,
  Genres.Comedy,
  Genres.Crime,
  Genres.Fantasy,
  Genres.Mystery,
  Genres.Horror,
  Genres.Thriller,
].sort();

export const mappedGenres: Genre[] = ['all', ...genres];

export const statusArray: string[] = ['available', 'loaned out'];
export const sortArray: sortValues[] = [
  {
    text: 'title (a-z)',
    value: 'title,asc',
  },
  {
    text: 'title (z-a)',
    value: 'title,desc',
  },
  {
    text: 'author (a-z)',
    value: 'author,asc',
  },
  {
    text: 'author (z-a)',
    value: 'author,desc',
  },
  {
    text: 'year (newest)',
    value: 'published_date,desc',
  },
  {
    text: 'year (oldest)',
    value: 'published_date,asc',
  },
];
