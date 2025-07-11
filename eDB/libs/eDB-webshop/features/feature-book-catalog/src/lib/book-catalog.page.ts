import {
  Component,
  computed,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';

import { BooksService } from '@eDB-webshop/client-books';
import {
  BookParamService,
  GENRE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from '@eDB-webshop/util-book-params';

import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';
import { UiIconComponent } from '@edb/shared-ui';
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
      class="flex flex-col gap-10 xl:gap-24 xl:flex-row max-w-[88%] xl:max-w-[72%] mt-48 mx-auto"
    >
      <!-- Filters (fixed ~15rem) -->
      <aside
        class="flex-shrink-0 xl:w-[17rem] p-6 rounded-xl backdrop-blur-md bg-white/70 shadow-md border border-white/40"
      >
        <h2 class="text-xl font-medium mb-6 flex items-center gap-2">
          <ui-icon name="faFilter" size="1.25rem" />
          Filters
        </h2>

        <book-filters
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
          [bookCount]="totalBooksCount() || 0"
          [selectedSort]="sort() || 'title,asc'"
          (sort)="onSort($event)"
          (clickEvent)="toggleShowList($event)"
        ></books-sort-bar>

        <!-- Results / loader -->
        <section class="min-h-[50vh] flex-1">
          @if (booksInfiniteQuery.isSuccess(); as _result) {
            @if (showList) {
              <books-collection-list-overview
                [books]="flattenedBooks() || []"
              />
            } @else {
              <books-collection-grid-overview
                [books]="flattenedBooks() || []"
              />
            }
          }
          @if (booksInfiniteQuery.isLoading()) {
            <ui-webshop-books-loading-state />
          }
          @if (booksInfiniteQuery.isError()) {
            <p class="text-red-500">Error loading books.</p>
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
