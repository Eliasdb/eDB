import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'add-button',
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button color="accent" (click)="addToCartEmit($event)">
      Add to cart
    </button>
  `,
})
export class AddButtonComponent {
  @Input() book?: Book | null;
  @Output() add = new EventEmitter<Event>();

  addToCartEmit($event: any) {
    this.add.emit($event);
  }
}
