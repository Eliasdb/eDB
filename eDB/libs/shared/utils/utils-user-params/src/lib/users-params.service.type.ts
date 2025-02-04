export const SEARCH_QUERY_PARAM = 'search';
export const SORT_QUERY_PARAM = 'sort';
export const CURSOR_QUERY_PARAM = 'cursor';

export interface UserQueryParams {
  [SEARCH_QUERY_PARAM]?: string;
  [SORT_QUERY_PARAM]?: string;
  [CURSOR_QUERY_PARAM]?: string;
}
