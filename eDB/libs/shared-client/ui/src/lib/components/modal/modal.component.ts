import {
  Component,
  EventEmitter,
  inject,
  input,
  model,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTextAreaComponent } from '../inputs/text-area/text-area.component';
import { UiTextInputComponent } from '../inputs/text-input/input.component';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [
    ModalModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiTextInputComponent,
    UiTextAreaComponent,
  ],
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
        } @else {
          @if (hasForm()) {
            <form [formGroup]="form" class="form space-y-4 pb-24 sm:pb-0">
              <ui-text-input
                label="Application Name"
                placeholder="Enter application name"
                formControlName="name"
                theme="light"
              ></ui-text-input>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ui-text-input
                  label="Route path"
                  placeholder="Enter route path"
                  formControlName="routePath"
                  theme="light"
                ></ui-text-input>
                <ui-text-input
                  label="Icon URL"
                  placeholder="Enter icon URL"
                  formControlName="iconUrl"
                  theme="light"
                ></ui-text-input>
              </div>

              <ui-text-input
                label="Tags (comma-separated)"
                placeholder="Enter tags"
                formControlName="tags"
                theme="light"
              ></ui-text-input>

              <ui-textarea
                label="Description"
                placeholder="Enter application description"
                formControlName="description"
                theme="light"
              ></ui-textarea>
            </form>
          } @else {
            <div class="confirmation-text py-4">
              <p>{{ content() }}</p>
            </div>
          }
        }
      </div>

      <cds-modal-footer class="sticky bottom-0 bg-white z-10 px-6 pt-4 pb-4">
        <div class="flex flex-wrap justify-end gap-2">
          <ui-button variant="tertiary" (buttonClick)="onCancel()" size="sm">
            Cancel
          </ui-button>
          <ui-button
            variant="primary"
            [disabled]="hasForm() && form.invalid"
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
  hasForm = model<boolean>(false);
  readonly template = input<TemplateRef<any> | undefined>();
  readonly context = input<any>();
  readonly cancelRoute = input<string | undefined>();

  form: FormGroup;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      routePath: [''],
      iconUrl: [''],
      tags: [''],
      description: [''],
    });
  }

  onCancel(): void {
    const cancelRoute = this.cancelRoute();
    if (cancelRoute) {
      this.router.navigate([cancelRoute]);
    }
    this.close.emit();
  }

  onSave(): void {
    if (this.hasForm()) {
      const formValue = this.form.value;
      formValue.tags = formValue.tags
        .split(',')
        .map((tag: string) => tag.trim());
      this.save.emit(formValue);
    } else {
      this.save.emit();
      const cancelRoute = this.cancelRoute();
      if (cancelRoute) {
        this.router.navigate([cancelRoute]);
      }
    }
    this.onCancel();
  }
}
