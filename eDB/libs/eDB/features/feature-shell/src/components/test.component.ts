import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { CartItemComponent } from '@eDB-webshop/ui-webshop';
@Component({
  selector: 'app-cart',
  imports: [CartItemComponent],
  template: `
    <div @slideAnimation class="cart-container">
      <app-cart-item />
    </div>
    <button (click)="toggleCart()">Toggle Cart</button>
  `,
  styles: [
    `
      :host {
        position: fixed;
      }
      .cart-container {
        position: fixed;
        top: 8rem;
        left: 0;
        width: 100vw;
        height: 30rem;
        background: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        z-index: 9000;
      }
    `,
  ],
  animations: [
    trigger('slideAnimation', [
      // On enter: start off-screen above and slide down into view.
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      // On leave: ensure starting at position and slide up out of view.
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class CartComponent {
  @Output() showCart = new EventEmitter<Event>();

  readonly isCartVisible = input<boolean>(false);

  toggleCart() {
    this.showCart.emit();
  }

  animationDone(event: any) {
    console.log('Animation done:', event);
    // Optionally, if you need to remove the element after animation,
    // you could set a flag here once the exit animation is complete.
  }
}
