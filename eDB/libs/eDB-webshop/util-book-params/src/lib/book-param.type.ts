import { Genre } from '@eDB-webshop/shared-data';

export const AUTHORS_QUERY_PARAM = 'author';
export const SEARCH_QUERY_PARAM = 'search';
export const GENRE_QUERY_PARAM = 'genre';
export const STATUS_QUERY_PARAM = 'status';
export const SORT_QUERY_PARAM = 'sort';

export type BookQueryParams = {
  [AUTHORS_QUERY_PARAM]?: string;
  [SEARCH_QUERY_PARAM]?: string;
  [STATUS_QUERY_PARAM]?: string;
  [SORT_QUERY_PARAM]?: string;
  [GENRE_QUERY_PARAM]?: Genre | string;
};
