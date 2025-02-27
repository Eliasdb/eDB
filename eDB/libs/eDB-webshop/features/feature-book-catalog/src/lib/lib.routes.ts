import { Route } from '@angular/router';
import { BooksCollectionContainer } from './book-catalog.page';
import { SingleBookContainer } from './components/single-book/single-book-container/single-book.container';

export const featureBookCatalogRoutes: Route[] = [
  { path: '', component: BooksCollectionContainer },
  { path: ':id', component: SingleBookContainer },
];
