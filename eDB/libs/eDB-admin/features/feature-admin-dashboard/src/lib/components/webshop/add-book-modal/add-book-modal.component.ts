import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';
import { UiButtonComponent } from '@eDB/shared-ui';
import { BookSnackbar } from '../book-snackbar/book-snackbar.component';

@Component({
  selector: 'cart-dialog',

  template: `
    <section class="header bg-black">
      <div class="flex justify-between items-center">
        <h2 mat-dialog-title>Add book</h2>
        <button
          mat-icon-button
          mat-dialog-close
          aria-label="Close dialog"
          class="flex items-center justify-center scale-[0.7] mr-4 "
        >
          <mat-icon class="align-top">close</mat-icon>
        </button>
      </div>

      <hr />
    </section>

    <mat-dialog-content class=" bg-black min-h-[calc(100vh-5rem)]">
      <form
        #addBookForm="ngForm"
        (ngSubmit)="onAddBook()"
        autocomplete="off"
        class="form"
      >
        <div class="inputs">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              class="form-control"
              name="title"
              [(ngModel)]="book.title"
              placeholder="Harry Potter"
            />
          </div>
          <div class="form-group">
            <label for="genre">Genre</label>
            <input
              type="text"
              class="form-control"
              name="genre"
              [(ngModel)]="book.genre"
              placeholder="e.g. fantasy, action, adventure..."
            />
          </div>

          <div class="form-group">
            <label for="author">Author</label>
            <input
              type="text"
              class="form-control"
              name="author"
              [(ngModel)]="book.author"
              placeholder="J.R.R. Tolkien"
            />
          </div>
          <div class="form-group">
            <label for="publishedDate">Published Date</label>
            <input
              type="text"
              class="form-control"
              name="publishedDate"
              [(ngModel)]="book.publishedDate"
              placeholder="2024"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="photoUrl">Photo Url</label>
          <input
            type="text"
            class="form-control"
            name="photoUrl"
            [(ngModel)]="book.photoUrl"
            placeholder="https://yoururl.com"
          />
          <label for="description">Description</label>
          <textarea
            rows="5"
            type="text"
            class="form-control"
            name="description"
            [(ngModel)]="book.description"
            placeholder="description"
          >
          </textarea>
          <div class="btn-container">
            <ui-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              class="remove-item-btn mt-8"
              [mat-dialog-close]="false"
              cdkFocusInitial
            >
              Add book
            </ui-button>
          </div>
        </div>

        <input
          type="hidden"
          class="form-control hidden"
          name="status"
          [(ngModel)]="book.status"
          value="available"
        />
      </form>
    </mat-dialog-content>
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    UiButtonComponent,
  ],
  styleUrls: ['./add-book-modal.component.scss'],
})
export class AddBookDialog {
  private snackBar = inject(MatSnackBar);
  private adminService = inject(AdminService);

  addBook = this.adminService.addBook();

  book: Book = {
    photoUrl: '',
    genre: '',
    title: '',
    author: '',
    status: 'available',
    publishedDate: '',
    description: '',
    id: 0,
    price: 0,
    stock: 0,
  };

  onAddBook() {
    this.addBook.mutate(this.book);
    this.snackBar.openFromComponent(BookSnackbar, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: { book: this.book.title, action: 'added' },
    });
  }
}
