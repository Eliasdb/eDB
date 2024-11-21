import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconComponent } from '@e-db/ui';
import { SideNavModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-sidenav',
  standalone: true,
  imports: [SideNavModule, CommonModule, UiIconComponent],
  template: `
    <div class="sidenav-container">
      <cds-sidenav>
        <cds-sidenav-item
          *ngFor="let item of links"
          [attr.href]="'#' + item.id"
          [active]="!!item.active"
          (click)="onItemClick($event, item)"
        >
          <ui-icon
            *ngIf="item.icon"
            [name]="item.icon"
            class="sidenav-icon"
            [fixedWidth]="true"
          ></ui-icon>
          {{ item.label }}
        </cds-sidenav-item>
      </cds-sidenav>
    </div>
  `,
  styles: [
    `
      .sidenav-container {
        width: 20rem;
      }

      cds-sidenav {
        z-index: initial;
        position: initial;
        inline-size: 20rem;
        max-inline-size: 20rem;
        padding: 0;
        background: #f4f4f4;

        nav {
          padding: 0;
        }
      }

      .sidenav-icon {
        margin-right: 0.5rem;
        vertical-align: middle;
        display: inline-block;
      }
    `,
  ],
})
export class UiSidenavComponent {
  @Input() links: {
    id: string;
    label: string;
    icon?: string;
    active?: boolean;
  }[] = [];
  @Output() linkClick = new EventEmitter<{ id: string; label: string }>();

  onItemClick(event: Event, item: { id: string; label: string }): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.linkClick.emit(item); // Emit the clicked link
  }
}
