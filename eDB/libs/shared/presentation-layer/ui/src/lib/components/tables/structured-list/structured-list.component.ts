import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule, StructuredListModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../../buttons/button/button.component';
import { UiIconComponent } from '../../icon/icon.component';
import { UiPasswordInputComponent } from '../../inputs/password-input/password-input.component';
import { UiTextInputComponent } from '../../inputs/text-input/input.component';

@Component({
  selector: 'ui-structured-list',
  imports: [
    CommonModule,
    FormsModule,
    StructuredListModule,
    UiIconComponent,
    UiButtonComponent,
    UiTextInputComponent,
    UiPasswordInputComponent,
    ButtonModule,
  ],
  template: `
    <cds-structured-list>
      <cds-list-header>
        <cds-list-column>
          <div class="header-container">
            <h3>{{ header() }}</h3>
            @if (headerIcon()) {
              <ui-icon
                [name]="headerIcon()"
                size="1.1rem"
                class="icon-gap"
              ></ui-icon>
            }
          </div>
        </cds-list-column>
      </cds-list-header>

      @if (uneditedMode()) {
        @for (row of rows(); let rowIndex = $index; track rowIndex) {
          <cds-list-row>
            <cds-list-column class="row-0 ">
              <section class="row-text">
                <p>{{ row[0] }}</p>
              </section>
            </cds-list-column>

            <cds-list-column class="row-1">
              @if (!isEditing(rowIndex)) {
                <section class="skeleton-text-wrapper">
                  <p>{{ row[1] }}</p>
                </section>
              } @else {
                <div class="input-button-container">
                  <ng-container [ngSwitch]="row[0]">
                    <ng-container *ngSwitchCase="'Password'">
                      <ui-password-input
                        [(ngModel)]="inputValues().newPassword"
                        label="New password"
                        placeholder="Enter new password"
                        size="md"
                      ></ui-password-input>
                      <ui-password-input
                        [(ngModel)]="inputValues().confirmPassword"
                        label="Confirm password"
                        placeholder="Confirm new password"
                        size="md"
                      ></ui-password-input>
                    </ng-container>
                    <ng-container *ngSwitchCase="'Name'">
                      <ui-text-input
                        [(ngModel)]="inputValues().firstName"
                        label="First name"
                        placeholder="Enter first name"
                        size="md"
                      ></ui-text-input>
                      <ui-text-input
                        [(ngModel)]="inputValues().lastName"
                        label="Last name"
                        placeholder="Enter last name"
                        size="md"
                      ></ui-text-input>
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                      <ui-text-input
                        [(ngModel)]="inputValues().value"
                        [label]="'Update your ' + row[0].toLowerCase()"
                        placeholder="Enter new value"
                        size="md"
                      ></ui-text-input>
                    </ng-container>
                  </ng-container>

                  <div class="button-container">
                    <ui-button
                      (buttonClick)="cancelEdit.emit(rowIndex)"
                      variant="secondary"
                      size="md"
                      [fullWidth]="true"
                    >
                      Cancel
                    </ui-button>
                    <ui-button
                      (buttonClick)="updateEdit.emit(rowIndex)"
                      variant="primary"
                      size="md"
                      [fullWidth]="true"
                    >
                      Update
                    </ui-button>
                  </div>
                </div>
              }
            </cds-list-column>

            <cds-list-column>
              <div
                class="action-container"
                [ngClass]="{
                  'disabled-action': isEditingAny() && !isEditing(rowIndex),
                }"
                (click)="onActionClick(rowIndex)"
              >
                @if (!isEditing(rowIndex)) {
                  <ng-container [ngSwitch]="header()">
                    <ng-container *ngSwitchCase="'Offboarding'">
                      <span class="delete-account-btn-container">Delete</span>
                      <ui-icon
                        name="faTrash"
                        size="16"
                        class="icon-gap"
                        color="red"
                      ></ui-icon>
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                      Edit
                      <ui-icon
                        name="faEdit"
                        size="16"
                        class="icon-gap"
                      ></ui-icon>
                    </ng-container>
                  </ng-container>
                }
              </div>
            </cds-list-column>
          </cds-list-row>
        }
      } @else {
        @for (row of rows(); let rowIndex = $index; track rowIndex) {
          <cds-list-row>
            <cds-list-column>
              <p class="row-0">{{ row[0] }}</p>
            </cds-list-column>

            <cds-list-column>
              <section class="skeleton-text-wrapper">
                <p>{{ row[1] }}</p>
              </section>
            </cds-list-column>
          </cds-list-row>
        }
      }
    </cds-structured-list>
  `,
  styleUrls: ['./structured-list.component.scss'],
})
export class UiStructuredListComponent {
  readonly header = input('');
  readonly headerIcon = input('');
  readonly rows = input<string[][]>([]);
  readonly editingRowIndex = input<number | null>(null);
  readonly isEditingAny = input(false);
  readonly inputValues = input<any>({});
  readonly uneditedMode = input<boolean>(false); // New input to control edit visibility

  @Output() actionClick = new EventEmitter<number>();
  @Output() updateEdit = new EventEmitter<number>();
  @Output() cancelEdit = new EventEmitter<number>();

  isEditing(rowIndex: number): boolean {
    return this.editingRowIndex() === rowIndex;
  }

  onActionClick(rowIndex: number): void {
    this.actionClick.emit(rowIndex);
  }
}
