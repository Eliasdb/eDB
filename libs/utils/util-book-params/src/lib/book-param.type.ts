import { Genre } from '../../../shared/client/data/src/lib/data';

export const SEARCH_QUERY_PARAM = 'searchFilter';
export const GENRE_QUERY_PARAM = 'genre';
export const STATUS_QUERY_PARAM = 'status';
export const SORT_QUERY_PARAM = 'sort';
export const LIMIT_QUERY_PARAM = 'limit';
export const OFFSET_QUERY_PARAM = 'offset';

export type BookQueryParams = {
  [SEARCH_QUERY_PARAM]?: string;
  [STATUS_QUERY_PARAM]?: string;
  [SORT_QUERY_PARAM]?: string;
  [GENRE_QUERY_PARAM]?: Genre | string;
  [LIMIT_QUERY_PARAM]?: number;
  [OFFSET_QUERY_PARAM]?: number;
};
