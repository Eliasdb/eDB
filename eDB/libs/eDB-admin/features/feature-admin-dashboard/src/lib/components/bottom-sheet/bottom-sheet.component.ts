import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminService } from '@eDB/client-admin';
import { take } from 'rxjs';
import { BookSnackbar } from '../book-snackbar/book-snackbar.component';

@Component({
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  selector: 'bottom-sheet',
  template: `
    <mat-toolbar>
      <div class="selected-books">
        <p class="items-selected">
          {{ this.selectedBooks$.getValue().length }} books selected
        </p>
        <span>|</span>
        <a mat-raised-button (click)="clearSelection()" class="clear-btn"
          >Clear</a
        >
      </div>

      <span class="example-spacer"></span>

      <button
        mat-icon-button
        class="example-icon"
        aria-label="Example icon-button with delete icon"
        (click)="deleteSelection()"
      >
        <mat-icon
          class="example-icon"
          aria-hidden="false"
          aria-label="Example delete icon"
          >delete</mat-icon
        >
      </button>
    </mat-toolbar>
  `,
  styleUrls: ['./bottom-sheet.component.scss'],
})
export class BottomSheetComponent {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  selectedBooks$ = this.adminService.selectedBooks$;
  selection = this.adminService.selection;
  deleteBook = this.adminService.deleteBook();

  private _bottomSheet = inject(MatBottomSheet);

  clearSelection(): void {
    this.selectedBooks$.next([]);
    this.selection.clear();
    this.adminService.isSheetClosed$.next(true);
    this._bottomSheet.dismiss(BottomSheetComponent);
  }

  deleteSelection() {
    this.selectedBooks$.pipe(take(1)).subscribe((selectedBooks) => {
      selectedBooks.forEach((book) => {
        if (book.id) this.deleteBook.mutate(book.id);
      });
      this.selectedBooks$.next([]);
      this.selection.clear();
      this.adminService.isSheetClosed$.next(true);
      this._bottomSheet.dismiss(BottomSheetComponent);
      this.snackBar.openFromComponent(BookSnackbar, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        data: { book: 'Selection', action: 'deleted' },
      });
    });
  }
}
