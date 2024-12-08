import { Component, EventEmitter, Output, input } from '@angular/core';
import { SideNavModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'ui-sidenav',
  standalone: true,
  imports: [SideNavModule, UiIconComponent],
  template: `
    <div class="sidenav-container">
      <cds-sidenav>
        @for (item of links(); track item.id) {
          <cds-sidenav-item
            [attr.href]="'#' + item.id"
            [active]="!!item.active"
            (click)="onItemClick($event, item)"
          >
            @if (item.icon) {
              <ui-icon [name]="item.icon" class="sidenav-icon"></ui-icon>
            }
            {{ item.label }}
          </cds-sidenav-item>
        }
      </cds-sidenav>
    </div>
  `,
  styleUrl: 'side-nav.component.scss',
})
export class UiSidenavComponent {
  readonly links = input<{
    id: string;
    label: string;
    icon?: string;
    active?: boolean;
}[]>([]);
  @Output() linkClick = new EventEmitter<{ id: string; label: string }>();

  onItemClick(event: Event, item: { id: string; label: string }): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.linkClick.emit(item); // Emit the clicked link
  }
}
