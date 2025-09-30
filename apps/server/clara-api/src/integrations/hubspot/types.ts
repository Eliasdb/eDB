export type Properties = Record<
  string,
  string | number | boolean | null | undefined
>;

export type HubspotObject = {
  id: string;
  properties: Properties;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
};

export type SearchRequest = {
  filterGroups: Array<{
    filters: Array<{ propertyName: string; operator: string; value: string }>;
  }>;
  sorts?: Array<{
    propertyName: string;
    direction: 'ASCENDING' | 'DESCENDING';
  }>;
  limit?: number;
  after?: string;
};

export type SearchResponse = {
  total: number;
  results: HubspotObject[];
  paging?: { next?: { after: string } };
};
