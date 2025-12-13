import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  model,
  Output,
  TemplateRef,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../buttons/button/button.component';

@Component({
  selector: 'ui-modal',
  imports: [ModalModule, ReactiveFormsModule, UiButtonComponent, CommonModule],
  template: `
    <cds-modal [open]="true" [size]="'md'" (close)="onCancel()">
      <cds-modal-header (closeSelect)="onCancel()">
        <h2 cdsModalHeaderLabel>Admin</h2>
        <h3 cdsModalHeaderHeading>{{ header() || 'Default Header' }}</h3>
      </cds-modal-header>

      <div class="max-h-[70vh] overflow-y-auto px-6">
        @if (template()) {
          <ng-container
            *ngTemplateOutlet="template(); context: context()"
          ></ng-container>
        } @else if (content()) {
          <div class="confirmation-text py-4">
            <p>{{ content() }}</p>
          </div>
        }
      </div>

      <cds-modal-footer class="sticky bottom-0 bg-white z-10 px-6 pt-4 pb-4">
        <div class="flex flex-wrap justify-end gap-2">
          <ui-button variant="tertiary" (buttonClick)="onCancel()" size="sm">
            Cancel
          </ui-button>
          <ui-button
            variant="primary"
            (buttonClick)="onSave()"
            [isExpressive]="true"
            size="sm"
          >
            Confirm
          </ui-button>
        </div>
      </cds-modal-footer>
    </cds-modal>
  `,
})
export class UiModalComponent {
  header = model<string>();
  content = model<string>();

  // ✅ FIX: switch from input() to model() to allow .set()
  readonly template = model<TemplateRef<unknown> | null>(null);
  readonly context = model<unknown>(null);
  readonly cancelRoute = model<string | undefined>(undefined);

  @Output() save = new EventEmitter<unknown>();
  @Output() close = new EventEmitter<void>();

  private router = inject(Router);

  onCancel(): void {
    const cancelRoute = this.cancelRoute();
    if (cancelRoute) {
      this.router.navigate([cancelRoute]);
    }
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
    this.onCancel();
  }
}
