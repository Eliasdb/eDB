// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import {
//   MatBottomSheet,
//   MatBottomSheetModule,
// } from '@angular/material/bottom-sheet';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import {
//   BookParamService,
//   SORT_QUERY_PARAM,
// } from '@eDB-webshop/util-book-params';
// import { AdminService } from '@eDB/client-admin';
// import { filterSuccessResult } from '@ngneat/query';
// import { combineLatest, map, shareReplay, switchMap, take } from 'rxjs';
// import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
// import { Book } from '../../../types/book.types';
// import { AdminBooksCollectionOverviewComponent } from '../admin-books-collection-overview/admin-books-collection-overview.component';
// @Component({
//   standalone: true,
//   imports: [
//     AdminBooksCollectionOverviewComponent,
//     MatToolbarModule,
//     MatIconModule,
//     MatButtonModule,
//     MatBottomSheetModule,
//     CommonModule,
//   ],
//   selector: 'admin-books-collection-container',
//   template: ` <section class="collection-container">
//     @if (booksResults$ | async; as result) {
//       @if (result.isSuccess) {
//         <admin-books-collection-overview
//           (sortAsc)="sortById($event)"
//           (sortDesc)="sortById($event)"
//           [books]="(books$ | async) || []"
//           (checkedState)="setCheckedState($event)"
//           (mainCheckedState)="setMainCheckedState($event)"
//           (itemSelected)="onItemSelected($event)"
//           (allItemSelected)="onAllItemSelected($event)"
//           (openSheet)="openBottomSheet()"
//         />
//       }
//     }
//   </section>`,
//   styleUrls: ['./admin-books-collection.container.scss'],
// })
// export class AdminBooksCollectionContainer {
//   private _bottomSheet = inject(MatBottomSheet);
//   private adminService = inject(AdminService);
//   private bookParamService = inject(BookParamService);

//   // protected books = inject(BooksService).getAdminBooks();
//   protected author$ = this.bookParamService.author$;
//   protected genre$ = this.bookParamService.genre$;
//   protected query$ = this.bookParamService.query$;
//   protected status$ = this.bookParamService.status$;
//   protected sort$ = this.bookParamService.sort$;

//   public showList: boolean = false;
//   public isSheetClosed$ = this.adminService.isSheetClosed$;
//   selectedBooks$ = this.adminService.selectedBooks$;
//   isChecked$ = this.adminService.isChecked$;
//   isMainChecked$ = this.adminService.isMainChecked$;
//   selection = this.adminService.selection;

//   protected booksResults$ = combineLatest([
//     this.query$,
//     this.author$,
//     this.genre$,
//     this.status$,
//     this.sort$,
//     // whenever these change value, it will start a call
//   ]).pipe(
//     switchMap(
//       ([search, author, genre, status, sort]) =>
//         this.adminService.queryAdminBooks({
//           search,
//           author,
//           genre,
//           status,
//           sort,
//         }).result$,
//     ),
//     shareReplay({ bufferSize: 1, refCount: false }),
//   );

//   protected totalBooksCount$ = this.booksResults$.pipe(
//     filterSuccessResult(),
//     map((res) => res.data.data.count),
//   );

//   protected books$ = this.booksResults$.pipe(
//     // don't need to subscribe because async pipe does it
//     filterSuccessResult(),
//     map((res) => res.data?.data.items),
//   );

//   protected sortById(sort: string) {
//     this.bookParamService.navigate({ [SORT_QUERY_PARAM]: sort });
//   }

//   protected setCheckedState(state: boolean) {
//     this.isChecked$.pipe(take(1)).subscribe(() => {
//       this.isChecked$.next(state);
//     });
//   }

//   protected setMainCheckedState(state: boolean) {
//     this.isMainChecked$.pipe(take(1)).subscribe(() => {
//       this.isMainChecked$.next(state);
//     });
//   }

//   protected onItemSelected(selected: Book) {
//     if (this.isChecked$.value === true) {
//       this.selectedBooks$.pipe(take(1)).subscribe((selectedBooks) => {
//         this.selectedBooks$.next([...selectedBooks, selected]);
//       });
//     }

//     if (this.isChecked$.value === false) {
//       this.selectedBooks$.pipe(take(1)).subscribe((selectedBooks) => {
//         const selectedId: number = selected.id || 0;
//         const selectedArray: number[] | undefined = [];
//         selectedArray.push(selectedId);

//         if (selectedBooks) {
//           const filteredItems = selectedBooks.filter(
//             ({ id }: Book) => !selectedArray?.includes(id || 0),
//           );
//           this.selectedBooks$.next(filteredItems);
//         }
//       });

//       // this.isSheetClosed$.next(true);
//     }
//   }

//   protected onAllItemSelected(selected: Book[]) {
//     if (this.isMainChecked$.value === true) {
//       this.selectedBooks$.pipe(take(1)).subscribe(() => {
//         this.selectedBooks$.next(selected);
//       });
//     }

//     if (this.isMainChecked$.value === false) {
//       this.selectedBooks$.pipe(take(1)).subscribe(() => {
//         this.selectedBooks$.next([]);
//       });
//       this.selection.clear();
//       this._bottomSheet.dismiss(BottomSheetComponent);
//       this.isSheetClosed$.next(true);
//     }
//   }

//   protected openBottomSheet(): void {
//     if (this.isSheetClosed$.getValue() === true) {
//       this._bottomSheet.open(BottomSheetComponent, {
//         hasBackdrop: false,
//         restoreFocus: false,
//       });
//       this.isSheetClosed$.next(false);
//     }
//   }
// }
