import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';
import { UiButtonComponent } from '@edb/shared-ui';
import { BookSnackbar } from '../book-snackbar/book-snackbar.component';

@Component({
  selector: 'cart-dialog',
  template: `
    <section class="header bg-black">
      <div class="flex justify-between items-center">
        <h2 mat-dialog-title>Edit book</h2>
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

    <mat-dialog-content class="bg-black min-h-[calc(100vh-5rem)]">
      <form
        #addBookForm="ngForm"
        (ngSubmit)="onEditBook()"
        autocomplete="off"
        class="form"
      >
        <div class="inputs">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              class="form-control text-black"
              name="title"
              [(ngModel)]="book.title"
              placeholder="Harry Potter"
            />
          </div>
          <div class="form-group">
            <label for="genre">Genre</label>
            <input
              type="text"
              class="form-control text-black"
              name="genre"
              [(ngModel)]="book.genre"
              placeholder="e.g. fantasy, action, adventure..."
            />
          </div>

          <div class="form-group">
            <label for="author">Author</label>
            <input
              type="text"
              class="form-control text-black"
              name="author"
              [(ngModel)]="book.author"
              placeholder="J.R.R. Tolkien"
            />
          </div>
          <div class="form-group">
            <label for="publishedDate">Published Date</label>
            <input
              type="text"
              class="form-control text-black"
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
            class="form-control text-black"
            name="photoUrl"
            [(ngModel)]="book.photoUrl"
            placeholder="https://yoururl.com"
          />
          <label for="description">Description</label>
          <textarea
            rows="5"
            type="text"
            class="form-control text-black"
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
              class="mt-8"
              [mat-dialog-close]="false"
              cdkFocusInitial
            >
              Edit book
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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    UiButtonComponent,
  ],
  styleUrls: ['./edit-book-modal.component.scss'],
})
export class EditBookDialog implements OnInit {
  book: Book; // Declare without initializing

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: number;
      title: string;
      genre: string;
      author: string;
      date: string;
      price: number;
      stock: number;
      status: string;
      photoUrl: string;
      description: string;
    },
  ) {
    // Now data is available, so initialize book here
    this.book = {
      id: data.id,
      title: data.title,
      genre: data.genre,
      author: data.author,
      publishedDate: data.date, // Assuming "date" corresponds to "publishedDate"
      photoUrl: data.photoUrl,
      description: data.description,
      status: data.status,
      price: data.price,
      stock: data.stock,
    };
  }

  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  editBook = this.adminService.editBook();

  onEditBook() {
    this.editBook.mutate(this.book);
    this.snackBar.openFromComponent(BookSnackbar, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: { book: this.book.title, action: 'edited' },
    });
  }

  ngOnInit(): void {
    this.book.title = this.data.title;
    this.book.genre = this.data.genre;
    this.book.author = this.data.author;
    this.book.publishedDate = this.data.date;
    this.book.photoUrl = this.data.photoUrl;
    this.book.description = this.data.description;
    console.log(this.book);
  }
}
