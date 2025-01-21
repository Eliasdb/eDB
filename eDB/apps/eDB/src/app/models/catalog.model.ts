export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  tags: string[];
  routePath: string;
}

export interface SubscribedApplication {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  tags: string[];
  routePath: string;
}
