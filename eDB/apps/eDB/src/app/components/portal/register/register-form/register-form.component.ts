import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  UiButtonComponent,
  UiPasswordInputComponent,
  UiTextInputComponent,
} from '@e-db/ui';
import { FormUtilsService } from '@e-db/utils';
import { registerFormFields } from './register-form.fields';

@Component({
  selector: 'platform-portal-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
  ],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <div class="form-row" *ngFor="let row of fieldRows">
          <div class="form-column" *ngFor="let field of row">
            <ng-container *ngIf="field">
              <ui-text-input
                *ngIf="field.controlType === 'text'"
                [formControlName]="field.controlName"
                [label]="field.label"
                [placeholder]="field.placeholder"
                [invalid]="isFieldInvalid(field.controlName)"
                [invalidText]="getErrorMessage(field.controlName)"
                [theme]="'dark'"
              ></ui-text-input>

              <ui-password-input
                *ngIf="field.controlType === 'password'"
                [formControlName]="field.controlName"
                [label]="field.label"
                [placeholder]="field.placeholder"
                [invalid]="isFieldInvalid(field.controlName)"
                [invalidText]="getErrorMessage(field.controlName)"
                [theme]="'dark'"
              ></ui-password-input>
            </ng-container>
          </div>
        </div>

        <div class="form-row">
          <div class="form-column">
            <ui-button
              type="submit"
              [isExpressive]="true"
              [disabled]="registerForm.invalid"
              [fullWidth]="true"
              [variant]="'primary'"
            >
              Register
            </ui-button>
          </div>
          <div class="form-column">
            <!-- Empty column -->
          </div>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  private formUtils = inject(FormUtilsService);

  registerForm!: FormGroup;
  fieldRows = registerFormFields;

  ngOnInit(): void {
    const flatFieldDefinitions = this.fieldRows
      .flat()
      .filter((field): field is NonNullable<typeof field> => !!field);

    this.registerForm = this.formUtils.createFormGroup(flatFieldDefinitions);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isFieldInvalid(this.registerForm, controlName);
  }

  getErrorMessage(controlName: string): string {
    const field = this.fieldRows
      .flat()
      .find(
        (f): f is NonNullable<typeof f> => !!f && f.controlName === controlName
      );
    return field
      ? this.formUtils.getErrorMessage(
          this.registerForm,
          controlName,
          field.errorMessages
        )
      : '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.getRawValue());
    }
  }
}
