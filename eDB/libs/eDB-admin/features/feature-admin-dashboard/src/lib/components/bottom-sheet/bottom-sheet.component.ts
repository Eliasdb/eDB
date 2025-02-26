import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminService } from '@eDB/client-admin';
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
          {{ adminService.selectedBooks().length }} books selected
        </p>
        <span>|</span>
        <a mat-raised-button (click)="clearSelection()" class="clear-btn">
          Clear
        </a>
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
  adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private _bottomSheet = inject(MatBottomSheet);

  // The service now holds signals for selectedBooks, isSheetClosed, etc.
  // The selection remains in the service as before.

  selectedBooks = this.adminService.selectedBooks;
  selection = this.adminService.selection;
  deleteBook = this.adminService.deleteBook();

  clearSelection(): void {
    this.adminService.selectedBooks.set([]);
    this.selection.clear();
    this.adminService.isSheetClosed.set(true);
    this._bottomSheet.dismiss(BottomSheetComponent);
  }

  deleteSelection(): void {
    const selectedBooks = this.adminService.selectedBooks();
    selectedBooks.forEach((book) => {
      if (book.id) {
        this.deleteBook.mutate(book.id);
      }
    });
    this.adminService.selectedBooks.set([]);
    this.selection.clear();
    this.adminService.isSheetClosed.set(true);
    this._bottomSheet.dismiss(BottomSheetComponent);
    this.snackBar.openFromComponent(BookSnackbar, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: { book: 'Selection', action: 'deleted' },
    });
  }
}
