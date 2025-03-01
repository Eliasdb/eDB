import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center gap-4">
      <button
        mat-mini-fab
        aria-label="Decrement quantity"
        (click)="decrement()"
      >
        <mat-icon>remove</mat-icon>
      </button>
      <span>{{ quantity() }}</span>
      <button mat-mini-fab (click)="increment()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  // Create an input signal with a default value of 1.
  quantity = model<number>(1);
  max = input<number>(); // This signal may be undefined if not provided.

  @Output() quantityChange = new EventEmitter<number>();

  increment() {
    // Allow increment only if current quantity is less than the maximum (or max is undefined)
    if (this.quantity() < (this.max() ?? Infinity)) {
      this.quantity.update((current) => current + 1);
      this.quantityChange.emit(this.quantity());
    }
  }

  decrement() {
    if (this.quantity() > 1) {
      this.quantity.update((current) => current - 1);
      this.quantityChange.emit(this.quantity());
    }
  }
}
