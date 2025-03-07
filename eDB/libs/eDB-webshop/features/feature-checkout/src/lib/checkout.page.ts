import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'register',
  template: `
    <section class="register-page">
      <div class="stepper-container">
        <form>
          <div class="title">
            <p>Sign up</p>
          </div>

          <mat-vertical-stepper
            #linearVerticalStepper="matVerticalStepper"
            formArrayName="formArray"
            [linear]="true"
          >
            <mat-step formGroupName="0">
              <ng-template matStepLabel>Personal details</ng-template>
              <div class="form-container">
                <div class="form-row">
                  <label>First name</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="firstNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Last name</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="lastNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Email</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="emailFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Username</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="userNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Phone</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="phoneNumberFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Password</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="passwordFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <div>
                <button mat-button matStepperNext type="button">Next</button>
              </div>
            </mat-step>

            <mat-step formGroupName="1">
              <ng-template matStepLabel>Address</ng-template>
              <div class="form-container">
                <div class="form-row">
                  <label>Address</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="addressFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>Postal code</label>
                  <div>
                    <mat-form-field>
                      <input
                        matInput
                        formControlName="postalCodeCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label>City</label>
                  <div>
                    <mat-form-field>
                      <input matInput formControlName="cityCtrl" required />
                    </mat-form-field>
                  </div>
                </div>
              </div>
              <div>
                <button mat-button matStepperPrevious type="button">
                  Back
                </button>
                <button mat-button matStepperNext type="button">Next</button>
              </div>
            </mat-step>

            <mat-step>
              <ng-template matStepLabel>Confirm</ng-template>
              <div class="text-container"><p>Ready to join the club?</p></div>
              <div>
                <button mat-button type="submit">Done</button>
                <button
                  type="button"
                  mat-button
                  (click)="linearVerticalStepper.reset()"
                >
                  Reset
                </button>
              </div>
            </mat-step>
          </mat-vertical-stepper>
        </form>
        <div class="bottom-text">
          <p>
            Already have an account? Click
            <span class="click"><a routerLink="/login">here</a></span> to login.
          </p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage {}
