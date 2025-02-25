import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'admin-stats-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-content class="rounded-lg">
        <section>
          <header>
            <span class="count">{{ count }}</span>
            <span class="icon"
              ><img src="./assets/add-book.svg" alt="add-books"
            /></span>
          </header>
          <h5 class="title">{{ subText }}</h5>
        </section>
      </mat-card-content>
    </mat-card>
  `,
  styleUrl: './admin-stats-card.component.scss',
})
export class AdminStatsCardComponent {
  @Input() count?: number;
  @Input() subText?: string;
}
