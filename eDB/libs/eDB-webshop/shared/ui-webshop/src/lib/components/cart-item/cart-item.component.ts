import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'cart-item',
  standalone: true,
  template: `
    @if (item) {
      <div class="content-container">
        <mat-checkbox
          class="example-margin"
          (click)="selectCartItem(item)"
          (change)="emitCheckedState($event)"
        ></mat-checkbox>
        <div class="img-container">
          <img
            src="https://edit.org/images/cat/book-covers-big-2019101610.jpg"
            class="single-book-image"
          />
        </div>
        <div class="book-data-container">
          <p class="text-bold">{{ item.title }}</p>
          <p>{{ item.author }}</p>
        </div>
      </div>
    }
  `,
  styleUrls: ['./cart-item.component.scss'],
  imports: [MatCheckboxModule, FormsModule, CommonModule],
})
export class CartItemComponent {
  @Input() item: Book | null = null;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() state = new EventEmitter<boolean>();

  selectCartItem(item: Book) {
    if (this.item) this.itemSelected.emit(item);
  }

  emitCheckedState(event: any) {
    if (this.item) this.state.emit(event.checked);
  }
}
