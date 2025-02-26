import { CommonModule } from '@angular/common';
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
import { take } from 'rxjs';
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
    CommonModule,
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
  private adminService = inject(AdminService);
  private bookParamService = inject(BookParamService);

  protected author = this.bookParamService.authorSignal;
  protected genre = this.bookParamService.genreSignal;
  protected query = this.bookParamService.querySignal;
  protected status = this.bookParamService.statusSignal;
  protected sort = this.bookParamService.sortSignal;

  public showList: boolean = false;
  public isSheetClosed$ = this.adminService.isSheetClosed$;
  selectedBooks$ = this.adminService.selectedBooks$;
  isChecked$ = this.adminService.isChecked$;
  isMainChecked$ = this.adminService.isMainChecked$;
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
    this.isChecked$.pipe(take(1)).subscribe(() => {
      this.isChecked$.next(state);
    });
  }

  protected setMainCheckedState(state: boolean) {
    this.isMainChecked$.pipe(take(1)).subscribe(() => {
      this.isMainChecked$.next(state);
    });
  }

  protected onItemSelected(selected: Book) {
    if (this.isChecked$.value === true) {
      this.selectedBooks$.pipe(take(1)).subscribe((selectedBooks) => {
        this.selectedBooks$.next([...selectedBooks, selected]);
      });
    }

    if (this.isChecked$.value === false) {
      this.selectedBooks$.pipe(take(1)).subscribe((selectedBooks) => {
        const selectedId: number = selected.id || 0;
        const selectedArray: number[] | undefined = [];
        selectedArray.push(selectedId);

        if (selectedBooks) {
          const filteredItems = selectedBooks.filter(
            ({ id }: Book) => !selectedArray?.includes(id || 0),
          );
          this.selectedBooks$.next(filteredItems);
        }
      });

      // this.isSheetClosed$.next(true);
    }
  }

  protected onAllItemSelected(selected: Book[]) {
    if (this.isMainChecked$.value === true) {
      this.selectedBooks$.pipe(take(1)).subscribe(() => {
        this.selectedBooks$.next(selected);
      });
    }

    if (this.isMainChecked$.value === false) {
      this.selectedBooks$.pipe(take(1)).subscribe(() => {
        this.selectedBooks$.next([]);
      });
      this.selection.clear();
      this._bottomSheet.dismiss(BottomSheetComponent);
      this.isSheetClosed$.next(true);
    }
  }

  protected openBottomSheet(): void {
    if (this.isSheetClosed$.getValue() === true) {
      this._bottomSheet.open(BottomSheetComponent, {
        hasBackdrop: false,
        restoreFocus: false,
      });
      this.isSheetClosed$.next(false);
    }
  }
}
