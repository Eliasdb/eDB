import { Component, EventEmitter, Output, input, model } from '@angular/core';
import { HeaderModule } from 'carbon-components-angular';

interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number; // You might convert the string to a number if necessary.
  book: Book;
}

export interface Book {
  id: number;
  photoUrl: string;
  genre: string;
  description: string;
  title: string;
  price: number;
  stock: number;
  author: string;
  status: string;
  publishedDate: string;
}

@Component({
  selector: 'ui-platform-subheader',
  imports: [HeaderModule],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name()" class="webshop-header">
      <!-- Hamburger Menu (for mobile) -->
      @if (hasHamburger()) {
        <cds-hamburger (click)="hamburgerToggle.emit($event)"></cds-hamburger>
      }

      <cds-header-global>
        <section class="action-bar-items">
          <img
            src="https://i.imghippo.com/files/SBfh8354yOw.png"
            alt="icon"
            class="launcher-icon"
            tabindex="0"
            role="button"
            (click)="onOpenDialog(isDialogOpen())"
            (keydown.enter)="onOpenDialog(isDialogOpen())"
            (keydown.space)="onOpenDialog(isDialogOpen())"
          />

          <span class="amount">{{ cartItems()?.length }}</span>
        </section>
      </cds-header-global>
    </cds-header>

    <!-- Brand Template -->
    <ng-template #brandTemplate>
      <a class="cds--header__name">
        <span class="cds--header__name--prefix">
          <div class="logo">
            <img
              src="https://i.imghippo.com/files/GP7783eG.png"
              alt="eDB logo"
              width="70"
              height="35"
            />
          </div>
        </span>
      </a>
    </ng-template>
  `,
  styleUrl: 'sub-header.component.scss',
})
export class UiPlatformSubHeaderComponent {
  readonly name = input<string>('eDB');
  readonly hasHamburger = input<boolean>(false);
  readonly cartItems = input<OrderItem[]>();
  isDialogOpen = model<boolean>(false);

  @Output() hamburgerToggle = new EventEmitter<Event>();
  @Output() linkClick = new EventEmitter<string>();
  @Output() openDialog = new EventEmitter<boolean>();

  onOpenDialog(isDialogOpen: boolean) {
    const newState = !isDialogOpen;
    this.isDialogOpen.set(newState);
    this.openDialog.emit(newState);
  }
}
