import { Component, Input, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { RouterLink } from '@angular/router';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  standalone: true,
  imports: [RouterLink, MatBottomSheetModule],
  selector: 'admin-sidebar',
  template: `
    <div class="content">
      <div class="nav-links">
        <ul>
          <li
            routerLink="/admin/stats"
            class="{{ isSidebarOpen ? 'nav-link active' : 'nav-link' }}"
            (click)="closeBottomSheet()"
          >
            <span class="icon"
              ><img
                src="https://www.svgrepo.com/show/522291/stats.svg"
                alt="stats-icon"
                class="icon-img"
            /></span>
            Statistics
          </li>

          <li
            routerLink="/admin/books"
            class="{{ isSidebarOpen ? 'nav-link active' : 'nav-link' }}"
          >
            <span class="icon"
              ><img
                src="https://www.svgrepo.com/show/528060/book-minimalistic.svg"
                alt="stats-icon"
                class="icon-img"
              />
            </span>
            Book Overview
          </li>

          <li
            routerLink="/admin/order-overview"
            class="{{ isSidebarOpen ? 'nav-link active' : 'nav-link' }}"
            (click)="closeBottomSheet()"
          >
            <span class="icon"
              ><img
                src="https://www.svgrepo.com/show/503678/order-food.svg"
                alt="stats-icon"
                class="icon-img"
              />
            </span>
            Order overview
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
}
