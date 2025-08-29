import {
  Component,
  computed,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';

import {
  BookParamService,
  GENRE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from '@eDB-webshop/util-book-params';
import { BooksService } from '@edb/client-books';

import { LoadingStateComponent, UiIconComponent } from '@edb/shared-ui';
import {
  BooksCollectionGridOverviewComponent,
  BooksCollectionListOverviewComponent,
  BooksFiltersComponent,
  BooksSortBarComponent,
} from './components/index';

@Component({
  selector: 'books-container',
  imports: [
    BooksCollectionGridOverviewComponent,
    BooksCollectionListOverviewComponent,
    BooksFiltersComponent,
    BooksSortBarComponent,
    LoadingStateComponent,
    UiIconComponent,
  ],
  template: `
    <section
      class="flex flex-col gap-10 xl:gap-24 lg:flex-row max-w-[88%] xl:max-w-[82%] mt-48 mx-auto "
      data-testid="webshop-root"
    >
      <!-- Filters (fixed ~15rem) -->
      <aside
        class="xl:self-start flex-shrink-0 lg:w-[17rem] p-6 rounded-xl backdrop-blur-md bg-white/70 shadow-md border border-white/40"
      >
        <h2 class="text-lg font-normal mb-6 flex items-center gap-2">
          <ui-icon name="faFilter" size="1.25rem" />
          Filters
        </h2>

        <book-filters
          data-testid="books-filters-form"
          [value]="query()"
          [bookStatus]="status()"
          [activeGenre]="genre()"
          (search)="onSearch($event)"
          (filterGenre)="filterGenre($event)"
          (filterStatus)="filterStatus($event)"
          (clearFilters)="clearFilters()"
        ></book-filters>
      </aside>

      <!-- Right‑hand (Books + sort) -->
      <section class="flex-1 flex flex-col gap-6">
        <!-- Section Title -->

        <books-sort-bar
          [showList]="showList"
          data-testid="books-sortbar"
          [bookCount]="totalBooksCount() || 0"
          [selectedSort]="sort() || 'title,asc'"
          (sort)="onSort($event)"
          (clickEvent)="toggleShowList($event)"
        ></books-sort-bar>

        <!-- Results / loader -->
        <section class="min-h-[50vh] flex-1" data-testid="books-results">
          @if (booksInfiniteQuery.isSuccess(); as _result) {
            @if (showList) {
              <books-collection-list-overview
                data-testid="books-list"
                [books]="flattenedBooks() || []"
              />
            } @else {
              <books-collection-grid-overview
                data-testid="books-grid"
                [books]="flattenedBooks() || []"
              />
            }
          }
          @if (booksInfiniteQuery.isLoading()) {
            <ui-webshop-books-loading-state data-testid="books-loading" />
          }
          @if (booksInfiniteQuery.isError()) {
            <p class="text-red-500" data-testid="books-error">
              Error loading books.
            </p>
          }
        </section>

        <div #scrollAnchor class="h-6"></div>
      </section>
    </section>
  `,
})
export class BooksCollectionContainer {
  private booksService = inject(BooksService);
  private bookParamService = inject(BookParamService);

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  protected genre = this.bookParamService.genreSignal;
  protected query = this.bookParamService.querySignal;
  protected status = this.bookParamService.statusSignal;
  protected sort = this.bookParamService.sortSignal;

  public showList = false;

  protected booksInfiniteQuery = this.booksService.booksInfiniteQuery;

  protected flattenedBooks = computed(() => {
    const data = this.booksInfiniteQuery.data();
    return data ? data.pages.flatMap((p) => p.data.items) : [];
  });

  protected totalBooksCount = this.booksService.totalBooksCount;

  toggleShowList(v: boolean) {
    this.showList = v;
  }

  /*––––– Query helpers –––––*/
  onSearch(q: string) {
    this.bookParamService.navigate({ [SEARCH_QUERY_PARAM]: q });
  }
  onSort(s: string) {
    this.bookParamService.navigate({ [SORT_QUERY_PARAM]: s });
  }
  filterGenre(g: string) {
    this.bookParamService.navigate({ [GENRE_QUERY_PARAM]: g });
  }
  filterStatus(st: string) {
    this.bookParamService.navigate({ [STATUS_QUERY_PARAM]: st });
  }
  clearFilters() {
    this.bookParamService.clearParams();
  }

  /*––––– Infinite scroll –––––*/
  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !this.booksInfiniteQuery.isFetchingNextPage()
        ) {
          this.booksInfiniteQuery.fetchNextPage();
        }
      },
      {
        // fetch sooner (top & bottom)
        rootMargin: '100px 0px',
        // fire once element is at least 10 % visible
        threshold: 0.1,
      },
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }
}
