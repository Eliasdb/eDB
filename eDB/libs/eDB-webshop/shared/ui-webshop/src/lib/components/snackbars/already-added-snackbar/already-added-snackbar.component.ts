import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'already-added-snackbar',
  imports: [MatIconModule],
  template: ` <div class="snack-bar">
    <div class="book-icon" matSnackBarLabel><mat-icon>error</mat-icon></div>
    <div>
      <p>{{ data.book }} is already {{ data.action }}</p>
    </div>
  </div>`,
  styleUrl: './already-added-snackbar.component.scss',
})
export class AlreadyAddedSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { book: string; action: string },
  ) {}
}
