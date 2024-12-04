import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiButtonComponent, UiStructuredListComponent } from '@eDB/shared-ui';
import { AdminService } from '../../../../services/admin-service/admin.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UiStructuredListComponent, UiButtonComponent],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="back-button-container">
          <ui-button
            variant="ghost"
            size="md"
            icon="faArrowLeft"
            (buttonClick)="goToOverview()"
          >
            Back
          </ui-button>
        </div>

        <div
          class="circle"
          [style.backgroundImage]="'url(https://i.pravatar.cc/150)'"
        ></div>
        <div class="user-info">
          <h2>{{ user()?.fullName }}</h2>
          <p>{{ user()?.email }}</p>
        </div>
      </div>

      <div class="structured-lists">
        <ui-structured-list
          header="Personal Details"
          [rows]="personalDetails()"
          [editingRowIndex]="editingRowIndex"
          [isEditingAny]="isEditingAny"
          [inputValues]="inputValues"
          (actionClick)="onActionClick($event)"
          (updateEdit)="onUpdateEdit($event)"
          (cancelEdit)="onCancelEdit()"
        ></ui-structured-list>

        <ui-structured-list
          header="Account Details"
          [rows]="accountDetails()"
          [editingRowIndex]="editingRowIndex"
          [isEditingAny]="isEditingAny"
          [inputValues]="inputValues"
          (actionClick)="onActionClick($event)"
          (updateEdit)="onUpdateEdit($event)"
          (cancelEdit)="onCancelEdit()"
        ></ui-structured-list>
      </div>
    </div>
  `,
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected user = signal<any>(null);
  editingRowIndex: number | null = null;
  isEditingAny = false;
  inputValues: any = {};

  personalDetails = computed(() => this.computePersonalDetails());
  accountDetails = computed(() => this.computeAccountDetails());
  isAdmin: boolean = true;

  constructor() {
    this.initializeUser();
  }

  private initializeUser() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.fetchUser(userId);
    }
  }

  private fetchUser(userId: number) {
    const userSignal = this.adminService.queryUserById(userId);
    effect(
      () => {
        const user = userSignal();
        if (user) {
          this.user.set({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  private computePersonalDetails(): [string, string][] {
    const user = this.user();
    if (!user) return [];
    return [
      ['Full Name', user.fullName],
      ['Email', user.email],
      ['Phone Number', user.phoneNumber ?? 'N/A'],
      ['Address', user.address],
      ['State/Province', user.state],
      ['Country', user.country],
      ['Company', user.company],
      ['Title', user.title],
    ];
  }

  private computeAccountDetails(): [string, string][] {
    const user = this.user();
    if (!user) return [];
    return [
      ['ID', user.id],
      ['Display Name', user.displayName],
      ['Role', user.role],
      ['Preferred Language', user.preferredLanguage],
    ];
  }

  onActionClick(rowIndex: number): void {
    if (this.isEditingAny) return;
    this.editingRowIndex = rowIndex;
    this.isEditingAny = true;
    this.initializeInputValues(rowIndex);
  }

  onUpdateEdit(rowIndex: number): void {
    this.onCancelEdit();
  }

  onCancelEdit(): void {
    this.editingRowIndex = null;
    this.isEditingAny = false;
    this.inputValues = {};
  }

  private initializeInputValues(rowIndex: number): void {
    const personalRow = this.personalDetails()[rowIndex];
    const accountRow = this.accountDetails()[rowIndex];
    if (personalRow) {
      this.inputValues = { value: personalRow[1] };
    } else if (accountRow) {
      this.inputValues = { value: accountRow[1] };
    }
  }

  goToOverview(): void {
    this.router.navigate(['/admin']); // Adjust '/overview' to your actual overview route
  }
}
