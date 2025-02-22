import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <section class="nav-container">
      <ul *ngIf="!hideLauncher" class="nav-items">
        <li>
          <a class="nav-link" routerLink="/home" routerLinkActive="active">
            Home
          </a>
        </li>
        <li>
          <a class="nav-link" routerLink="/books" routerLinkActive="active">
            Books
          </a>
        </li>
      </ul>
    </section>
  `,
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input()
  hideLauncher!: boolean;
}
