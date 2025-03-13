import { Route } from '@angular/router';
import { BooksCollectionContainer } from './book-catalog.page';
import { SingleBookPage } from './pages/single-book/single-book.page';

export const featureBookCatalogRoutes: Route[] = [
  { path: '', component: BooksCollectionContainer },
  { path: ':id', component: SingleBookPage },
];
