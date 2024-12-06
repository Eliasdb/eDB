import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { UiSidenavComponent, UiStructuredListComponent } from '@eDB/shared-ui';
import { SettingsGroup } from '../../../models/settings.model';
import { LinkItem } from '../../../models/user.model';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';
import { settingsGroups } from './profile.page.config';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [CommonModule, UiSidenavComponent, UiStructuredListComponent],
  template: `
    <section class="settings-page">
      <section class="sidenav">
        <h3 class="profile-title">Profile</h3>
        <ui-sidenav
          [links]="links"
          (linkClick)="onLinkClick($event)"
        ></ui-sidenav>
      </section>

      <section class="settings-container" #settingsContainer>
        <ng-container
          *ngFor="let group of settingsGroups; trackBy: trackByGroupId"
        >
          <ui-structured-list
            [header]="group.header"
            [headerIcon]="group.headerIcon"
            [rows]="computedRows[group.id]()"
            [editingRowIndex]="
              isEditingGroup(group.id) ? editingRowIndex : null
            "
            [isEditingAny]="isEditingAny"
            [inputValues]="inputValues"
            (actionClick)="onActionClick(group.id, $event)"
            (updateEdit)="onUpdateEdit(group.id, $event)"
            (cancelEdit)="onCancelEdit()"
            [editMode]="true"
            [id]="group.id"
          ></ui-structured-list>
        </ng-container>
      </section>
    </section>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  settingsGroups = settingsGroups;
  links: LinkItem[] = settingsGroups.map((g) => ({
    id: g.id,
    label: g.header,
    icon: g.headerIcon,
    active: false,
  }));

  computedRows: { [groupId: string]: Signal<[string, string][]> } = {};

  editingGroupId: string | null = null;
  editingRowIndex: number | null = null;
  isEditingAny = false;
  inputValues: any = {};

  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();
  private updateUserProfileMutation =
    this.userProfileService.updateUserProfile();

  constructor() {
    this.initializeComputedRows();
  }

  // SIDENAV
  onLinkClick(clickedItem: LinkItem): void {
    this.links.forEach((link) => (link.active = link.id === clickedItem.id));
    const element = document.getElementById(clickedItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id '${clickedItem.id}' not found.`);
    }
  }

  // STRUCTURED LIST
  private initializeComputedRows(): void {
    this.settingsGroups.forEach((group) => {
      this.computedRows[group.id] = computed(() => this.computeRows(group));
    });
  }

  private computeRows(group: SettingsGroup): [string, string][] {
    const profile = this.userProfileQuery.data();
    return group.rows.map((row) => [row.label, row.getValue(profile) ?? '']);
  }

  private initializeInputValues(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    const fieldName = group.rows[rowIndex].label;
    const currentValue = this.computedRows[groupId]()[rowIndex][1] || '';

    switch (fieldName) {
      case 'Password':
        this.inputValues = { newPassword: '', confirmPassword: '' };
        break;

      case 'Name': {
        const profile = this.userProfileQuery.data();
        this.inputValues = {
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
        };
        console.log('Initialized input values for Name:', this.inputValues);
        break;
      }

      default:
        this.inputValues = { value: currentValue };
        break;
    }
  }

  onActionClick(groupId: string, rowIndex: number): void {
    if (this.isEditingAny) return;
    this.editingGroupId = groupId;
    this.editingRowIndex = rowIndex;
    this.isEditingAny = true;
    this.initializeInputValues(groupId, rowIndex);
  }

  onUpdateEdit(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    const row = group.rows[rowIndex];
    const field = row.label;
    let payload: any = {};

    switch (field) {
      case 'Password':
        if (this.inputValues.newPassword !== this.inputValues.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
        payload.password = this.inputValues.newPassword;
        break;

      case 'Name': {
        const profile = this.userProfileQuery.data();
        const oldFirstName = profile?.firstName ?? '';
        const oldLastName = profile?.lastName ?? '';

        const newFirstName = this.inputValues.firstName.trim();
        const newLastName = this.inputValues.lastName.trim();

        payload.firstName = newFirstName || oldFirstName;
        payload.lastName = newLastName || oldLastName;

        console.log('Updating Name:', payload);
        break;
      }

      default:
        if (!row.payloadKey) {
          console.error(`Unknown field: ${field}`);
          return;
        }
        payload[row.payloadKey] = this.inputValues.value;
        console.log(`Updating ${row.payloadKey}:`, payload[row.payloadKey]);
        break;
    }

    this.updateUserProfileMutation.mutate(payload, {
      onSuccess: () => {
        console.log('User profile updated successfully', payload);
        this.onCancelEdit();
      },
      onError: (err) => {
        console.error('Failed to update user profile:', err);
        this.onCancelEdit();
      },
    });
  }

  onCancelEdit(): void {
    this.editingGroupId = null;
    this.editingRowIndex = null;
    this.isEditingAny = false;
    this.inputValues = {};
  }

  trackByGroupId(_: number, group: SettingsGroup): string {
    return group.id;
  }

  protected isEditingGroup(groupId: string): boolean {
    return this.editingGroupId === groupId;
  }
}
