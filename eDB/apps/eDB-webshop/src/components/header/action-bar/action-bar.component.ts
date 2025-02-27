import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '@eDB-webshop/client-cart';
import { CartDialog } from '@eDB-webshop/ui-webshop';

@Component({
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  selector: 'action-bar',
  template: `
    <section class="action-bar-container">
      @if (!hideLauncher) {
        <section class="action-bar-items">
          <img
            src="https://i.imghippo.com/files/GP7783eG.png"
            alt="logo"
            class="logo"
          />
          <img
            src="https://i.imghippo.com/files/SBfh8354yOw.png"
            alt="icon"
            class="launcher-icon"
            (click)="openDialog()"
          />
          <span class="amount">{{ this.cartService.getItems().length }}</span>
        </section>
      }
      @if (hideLauncher) {
        <section class="action-bar-items">
          <img src="/assets/logo-inverted.png" alt="logo" class="logo" />
        </section>
      }
    </section>
  `,
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
  private dialog = inject(MatDialog);
  protected cartService = inject(CartService);
  @Input()
  hideLauncher!: boolean;

  openDialog() {
    const dialogRef = this.dialog.open(CartDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
