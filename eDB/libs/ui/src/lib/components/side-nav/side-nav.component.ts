import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideNavModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-sidenav',
  standalone: true,
  imports: [SideNavModule, CommonModule],
  template: `
    <div class="sidenav-container">
      <cds-sidenav>
        <cds-sidenav-item
          *ngFor="let item of links"
          [attr.href]="'#' + item.id"
          [active]="!!item.active"
          (click)="onItemClick($event, item)"
        >
          {{ item.label }}
        </cds-sidenav-item>
      </cds-sidenav>
    </div>
  `,
  styleUrls: ['side-nav.component.scss'],
})
export class UiSidenavComponent {
  @Input() links: { id: string; label: string; active?: boolean }[] = [];
  @Output() linkClick = new EventEmitter<{ id: string; label: string }>();

  onItemClick(event: Event, item: { id: string; label: string }): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.linkClick.emit(item); // Emit the clicked link
  }
}
