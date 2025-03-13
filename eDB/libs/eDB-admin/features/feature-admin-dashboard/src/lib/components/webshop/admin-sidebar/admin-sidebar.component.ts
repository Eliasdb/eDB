import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  imports: [MatBottomSheetModule],
  selector: 'admin-sidebar',
  template: `
    <div class="content">
      <div class="nav-links">
        <ul>
          <li
            class="{{ isSidebarOpen ? 'nav-link active' : 'nav-link' }}"
            (click)="handleItemClick('books')"
          >
            <span class="icon"
              ><img src="/book-svg.svg" alt="stats-icon" class="icon-img" />
            </span>
            Book Overview
          </li>

          <li
            class="{{ isSidebarOpen ? 'nav-link active' : 'nav-link' }}"
            (click)="handleItemClick('order-overview')"
          >
            <span class="icon"
              ><img
                src="https://www.svgrepo.com/show/503678/order-food.svg"
                alt="stats-icon"
                class="icon-img"
              />
            </span>
            Order Overview
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  @Input() isSidebarOpen: boolean | undefined;
  private _bottomSheet = inject(MatBottomSheet);

  closeBottomSheet(): void {
    this._bottomSheet.dismiss(BottomSheetComponent);
  }

  @Output() itemSelected = new EventEmitter<'books' | 'order-overview'>();

  handleItemClick(itemId: 'books' | 'order-overview'): void {
    this.closeBottomSheet();
    this.itemSelected.emit(itemId);
  }
}
