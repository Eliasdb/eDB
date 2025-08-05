import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '@eDB/client-admin';
import { UiButtonComponent, UiStructuredListComponent } from '@edb/shared-ui';

@Component({
  selector: 'platform-user-profile',
  imports: [UiStructuredListComponent, UiButtonComponent],
  // Removed styleUrls; all styling is now applied using Tailwind classes.
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen max-w-[1200px] mx-auto py-12"
    >
      <!-- Profile Header -->
      <div class="w-full text-center mb-8">
        <div class="back-button-container flex">
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
          class="circle w-[100px] h-[100px] bg-[#ccc] bg-cover bg-center bg-no-repeat rounded-full mx-auto"
          [style.backgroundImage]="'url(https://i.pravatar.cc/150)'"
        ></div>

        <div class="user-info">
          <h2 class="mt-2 text-2xl">{{ user()?.fullName }}</h2>
          <p class="m-0 text-base text-[#666]">{{ user()?.email }}</p>
        </div>
      </div>

      <!-- Structured Lists -->
      <div
        class="structured-lists flex flex-col md:flex-row justify-between gap-4 w-full"
      >
        <div class="flex-1 md:max-w-[50%] px-4">
          <ui-structured-list
            header="Personal Details"
            [rows]="personalDetails()"
            [editingRowIndex]="editingRowIndex"
            [isEditingAny]="isEditingAny"
            [inputValues]="inputValues"
            (actionClick)="onActionClick($event)"
            (updateEdit)="onUpdateEdit()"
            (cancelEdit)="onCancelEdit()"
          ></ui-structured-list>
        </div>

        <div class="flex-1 md:max-w-[50%] px-4">
          <ui-structured-list
            header="Account Details"
            [rows]="accountDetails()"
            [editingRowIndex]="editingRowIndex"
            [isEditingAny]="isEditingAny"
            [inputValues]="inputValues"
            (actionClick)="onActionClick($event)"
            (updateEdit)="onUpdateEdit()"
            (cancelEdit)="onCancelEdit()"
          ></ui-structured-list>
        </div>
      </div>
    </div>
  `,
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
  isAdmin = true;

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
    effect(() => {
      const user = userSignal();
      if (user) {
        this.user.set({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        });
      }
    });
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

  onUpdateEdit(): void {
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
    this.router.navigate(['/']); // Adjust route as needed.
  }
}
