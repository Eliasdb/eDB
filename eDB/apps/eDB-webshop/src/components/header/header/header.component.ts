import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ActionBarComponent, NavBarComponent, CommonModule],
  template: `
    <section [ngClass]="[headerBackgroundColour]" class="header-container">
      <header class="header">
        <action-bar [hideLauncher]="hideLauncher" />
        <nav-bar [ngClass]="headerTextColour" [hideLauncher]="hideLauncher" />
      </header>
    </section>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input()
  headerBackgroundColour!: string;
  @Input()
  headerTextColour!: string;
  @Input()
  hideLauncher!: boolean;
  @Input()
  logoTheme!: string;
}
