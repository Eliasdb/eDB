export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  tags: string[];
  isSubscribed: boolean;
  routePath: string;
}
