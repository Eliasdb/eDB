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
  selector: 'lib-register', // ✔️ kebab-case + lib prefix
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
  template: `
    <section class="register-page">
      <div class="stepper-container">
        <form>
          <div class="title"><p>Sign up</p></div>

          <mat-vertical-stepper
            #linearVerticalStepper="matVerticalStepper"
            formArrayName="formArray"
            [linear]="true"
          >
            <mat-step formGroupName="0">
              <ng-template matStepLabel>Personal details</ng-template>
              <div class="form-container">
                <div class="form-row">
                  <label for="firstName">First name</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="firstName"
                        matInput
                        formControlName="firstNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="lastName">Last name</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="lastName"
                        matInput
                        formControlName="lastNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="email">Email</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="email"
                        matInput
                        formControlName="emailFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="username">Username</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="username"
                        matInput
                        formControlName="userNameFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="phone">Phone</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="phone"
                        matInput
                        formControlName="phoneNumberFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="password">Password</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="password"
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
                  <label for="address">Address</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="address"
                        matInput
                        formControlName="addressFormCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="postal">Postal code</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="postal"
                        matInput
                        formControlName="postalCodeCtrl"
                        required
                      />
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-row">
                  <label for="city">City</label>
                  <div>
                    <mat-form-field>
                      <input
                        id="city"
                        matInput
                        formControlName="cityCtrl"
                        required
                      />
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
export class CheckoutPageComponent {} // ✔️ Name ends in Component
