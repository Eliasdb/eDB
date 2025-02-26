import { Overlay } from '@angular/cdk/overlay';
import { Component, computed, effect, inject } from '@angular/core';
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
import { Book } from '../../../types/book.types';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { AdminBooksCollectionOverviewComponent } from '../admin-books-collection-overview/admin-books-collection-overview.component';
@Component({
  standalone: true,
  imports: [
    AdminBooksCollectionOverviewComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
  ],
  selector: 'admin-books-collection-container',
  template: ` <section class="text-black py-8">
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
  </section>`,
})
export class AdminBooksCollectionContainer {
  private _bottomSheet = inject(MatBottomSheet);
  private overlay = inject(Overlay);
  private adminService = inject(AdminService);
  private bookParamService = inject(BookParamService);

  protected author = this.bookParamService.authorSignal;
  protected genre = this.bookParamService.genreSignal;
  protected query = this.bookParamService.querySignal;
  protected status = this.bookParamService.statusSignal;
  protected sort = this.bookParamService.sortSignal;

  public showList: boolean = false;
  isSheetClosed = this.adminService.isSheetClosed;
  selectedBooks = this.adminService.selectedBooks;
  isChecked = this.adminService.isChecked;
  isMainChecked = this.adminService.isMainChecked;
  selection = this.adminService.selection;

  private updateEffect = effect(() => {
    const search = this.query();
    const author = this.author();
    const genre = this.genre();
    const status = this.status();
    const sort = this.sort();

    this.adminService.updateQueryAdminBooks({
      search,
      author,
      genre,
      status,
      sort,
    });
  });

  protected booksQuery = computed(() => this.adminService.queryAdminBooks);

  protected totalBooksCount = computed(() => {
    const result = this.booksQuery().data();
    return result ? result.data.count : 0;
  });

  protected books = computed(() => {
    const result = this.booksQuery().data();
    return result ? result.data.items : [];
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
      // Add the book if it's not already in the list.
      this.selectedBooks.update((books) => {
        if (!books.find((b) => b.id === selected.id)) {
          // Also update the SelectionModel.
          this.selection.select(selected);
          return [...books, selected];
        }
        return books;
      });
    } else {
      // Remove the book.
      this.selectedBooks.update((books) =>
        books.filter((b) => b.id !== selected.id),
      );
      this.selection.deselect(selected);
    }
  }

  protected onAllItemSelected(allBooks: Book[]) {
    if (this.isMainChecked()) {
      // When the “select all” checkbox is active, update selectedBooks and SelectionModel.
      this.selectedBooks.set([...allBooks]);
      this.selection.select(...allBooks);
    } else {
      // Otherwise, clear the selection.
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
        hasBackdrop: false,
        restoreFocus: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
      this.isSheetClosed.set(false);
    }
  }
}
