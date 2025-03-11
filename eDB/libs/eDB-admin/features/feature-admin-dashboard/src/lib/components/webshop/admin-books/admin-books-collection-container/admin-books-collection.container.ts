import { Overlay } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  BookParamService,
  SORT_QUERY_PARAM,
} from '@eDB-webshop/util-book-params';
import { AdminService } from '@eDB/client-admin';
import { Book } from '../../../../types/book.type';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { AdminBooksCollectionOverviewComponent } from '../admin-books-collection-overview/admin-books-collection-overview.component';

@Component({
  imports: [
    AdminBooksCollectionOverviewComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
  ],
  selector: 'admin-books-collection-container',
  template: `
    <section class="text-black py-8">
      @if (booksQuery(); as result) {
        @if (result?.data) {
          <admin-books-collection-overview
            [books]="books()"
            (sortAsc)="sortById($event)"
            (sortDesc)="sortById($event)"
            (checkedState)="setCheckedState($event)"
            (mainCheckedState)="setMainCheckedState($event)"
            (itemSelected)="onItemSelected($event)"
            (allItemSelected)="onAllItemSelected($event)"
            (openSheet)="openBottomSheet()"
          />
        }
      }
      <!-- Sentinel element to detect when to load next page -->
      <div #infiniteScrollSentinel style="height: 1px;"></div>
    </section>
  `,
})
export class AdminBooksCollectionContainer implements AfterViewInit, OnDestroy {
  private _bottomSheet = inject(MatBottomSheet);
  private overlay = inject(Overlay);
  private adminService = inject(AdminService);
  private bookParamService = inject(BookParamService);

  public showList: boolean = false;
  isSheetClosed = this.adminService.isSheetClosed;
  isMainChecked = this.adminService.isMainChecked;
  isChecked = this.adminService.isChecked;
  selectedBooks = this.adminService.selectedBooks;
  selection = this.adminService.selection;

  // Access the infinite query from AdminService.
  protected booksQuery = computed(() => this.adminService.queryAdminBooks);

  // For infinite queries, aggregate pages into a flat list.
  protected books = computed(() => {
    const result = this.booksQuery().data();
    if (result && result.pages) {
      return result.pages.flatMap((page) => page.data.items);
    }
    return [];
  });

  protected totalBooksCount = computed(() => {
    const result = this.booksQuery().data();
    return result ? result.pages?.[0]?.data.count || 0 : 0;
  });

  protected sortById(sort: string) {
    this.bookParamService.navigate({ [SORT_QUERY_PARAM]: sort });
  }

  protected setCheckedState(state: boolean) {
    this.isChecked.set(state);
  }

  protected setMainCheckedState(state: boolean) {
    this.isMainChecked.set(state);
  }

  protected onItemSelected(selected: Book) {
    if (this.isChecked()) {
      this.selectedBooks.update((books) => {
        if (!books.find((b) => b.id === selected.id)) {
          this.selection.select(selected);
          return [...books, selected];
        }
        return books;
      });
    } else {
      this.selectedBooks.update((books) =>
        books.filter((b) => b.id !== selected.id),
      );
      this.selection.deselect(selected);
    }
  }

  protected onAllItemSelected(allBooks: Book[]) {
    if (this.isMainChecked()) {
      this.selectedBooks.set([...allBooks]);
      this.selection.select(...allBooks);
    } else {
      this.selectedBooks.set([]);
      this.selection.clear();
      this._bottomSheet.dismiss(BottomSheetComponent);
      this.isSheetClosed.set(true);
    }
  }

  protected openBottomSheet(): void {
    if (this.isSheetClosed()) {
      console.log('Opening bottom sheet');
      this._bottomSheet.open(BottomSheetComponent, {
        disableClose: true,
        hasBackdrop: false,
        restoreFocus: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
      this.isSheetClosed.set(false);
    }
  }

  @ViewChild('infiniteScrollSentinel', { static: false })
  infiniteScrollSentinel!: ElementRef<HTMLDivElement>;

  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    // Create an IntersectionObserver that listens for the sentinel to be visible.
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const query = this.booksQuery();
          if (query.fetchNextPage) {
            query.fetchNextPage();
          }
        }
      });
    });
    // Start observing the sentinel element.
    if (this.infiniteScrollSentinel) {
      this.observer.observe(this.infiniteScrollSentinel.nativeElement);
    }
  }

  ngOnDestroy() {
    // Clean up the observer when the component is destroyed.
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
