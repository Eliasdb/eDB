import { Component, Input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ui-webshop-quantity-selector',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center justify-center">
      <button
        mat-mini-fab
        aria-label="Decrement quantity"
        (click)="decrement()"
        class="scale-[0.5]"
      >
        <mat-icon>remove</mat-icon>
      </button>

      <span>{{ quantity() }}</span>

      <button
        mat-mini-fab
        aria-label="Increment quantity"
        (click)="increment()"
        class="scale-[0.5]"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  /** Two-way bound model – usable with [(quantity)] */
  quantity = model<number>(0);

  /** Optional upper limit for the counter */
  @Input() max?: number;

  increment() {
    if (this.quantity() < (this.max ?? Infinity)) {
      this.quantity.update((v) => v + 1); // fires quantityChange automatically
    }
  }

  decrement() {
    if (this.quantity() > 1) {
      this.quantity.update((v) => v - 1);
    }
  }
}
