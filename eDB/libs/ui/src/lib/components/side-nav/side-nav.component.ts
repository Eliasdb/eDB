import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
          (click)="scrollToSection(item.id)"
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

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
