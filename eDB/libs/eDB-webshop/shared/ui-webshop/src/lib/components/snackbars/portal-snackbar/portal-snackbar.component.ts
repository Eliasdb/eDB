import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'portal-snackbar',
  imports: [MatIconModule],
  template: ` <div class="snack-bar">
    <div class="book-icon" matSnackBarLabel><mat-icon>person</mat-icon></div>
    <div>
      <p>{{ data.user }} has been {{ data.action }} successfully!</p>
    </div>
  </div>`,
  styleUrl: './portal-snackbar.component.scss',
})
export class PortalSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { user: string; action: string },
  ) {}
}
