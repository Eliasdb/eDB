import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'admin-book-snackbar',
  standalone: true,
  imports: [MatIconModule],
  template: ` <div class="snack-bar">
    <div class="book-icon" matSnackBarLabel><mat-icon>book</mat-icon></div>
    <div>
      <p>{{ data.book }} has been {{ data.action }}!</p>
    </div>
  </div>`,
  styleUrl: './book-snackbar.component.scss',
})
export class BookSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { book: string; action: string }
  ) {}
}
