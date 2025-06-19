import { Component, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'ui-webshop-books-loading-state',
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
