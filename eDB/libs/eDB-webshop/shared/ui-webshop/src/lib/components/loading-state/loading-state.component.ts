import { Component, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'books-loading-state',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="books-loader">
      <section class="loader-inner">
        <mat-spinner></mat-spinner>
        <p class="loader-text">Fetching from database...</p>
      </section>
    </div>
  `,
  styleUrls: ['./loading-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingStateComponent {}
