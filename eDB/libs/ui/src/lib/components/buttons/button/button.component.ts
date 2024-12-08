import { Component, EventEmitter, Output, input } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';
import { UiLoadingSpinnerComponent } from '../../loading/loading-spinner.component';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [ButtonModule, UiLoadingSpinnerComponent, UiIconComponent],
  template: `
    <button
      [class.full-width]="fullWidth()"
      [cdsButton]="variant()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
      [size]="size()"
      [isExpressive]="isExpressive()"
      [type]="type()"
    >
      <span class="button-text">
        <ng-content></ng-content>
      </span>

      @if (icon() && !loading()) {
        <ui-icon class="cds--btn__icon" [name]="icon()"></ui-icon>
      } @else if (loading()) {
        <ui-loading class="cds--btn__icon" [isActive]="true"></ui-loading>
      }
    </button>
  `,
  styleUrls: ['./button.component.scss'], // Corrected styleUrl to styleUrls
})
export class UiButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'>('primary');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly icon = input<string>();
  readonly isExpressive = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.buttonClick.emit(event);
    }
  }
}
