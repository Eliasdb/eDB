import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { UiSidenavComponent } from '@eDB/shared-ui';
import { PlatformProfileSettingsGroup } from '../../../components/platform/profile/settings-group/settings-group.component';
import { SettingsGroup } from '../../../models/settings.model';
import { LinkItem } from '../../../models/user.model';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';
import { settingsGroups } from './settings-data';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [CommonModule, UiSidenavComponent, PlatformProfileSettingsGroup],
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
          <platform-profile-settings-group
            [id]="group.id"
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
          ></platform-profile-settings-group>
        </ng-container>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer {
  settingsGroups = settingsGroups;

  links: LinkItem[] = this.settingsGroups.map((group) => ({
    id: group.id,
    label: group.header,
    icon: group.headerIcon,
    active: false,
  }));

  computedRows: { [groupId: string]: Signal<[string, string][]> } = {};

  // State management for edit mode
  editingGroupId: string | null = null;
  editingRowIndex: number | null = null;
  isEditingAny: boolean = false;
  inputValues: any = {};

  // Private properties
  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();
  private updateUserProfileMutation =
    this.userProfileService.updateUserProfile();

  constructor() {
    this.initializeComputedRows();
  }

  // Public methods
  onActionClick(groupId: string, rowIndex: number): void {
    if (this.isEditingAny) return; // Prevent multiple edits
    this.editingGroupId = groupId;
    this.editingRowIndex = rowIndex;
    this.isEditingAny = true;
    this.initializeInputValues(groupId, rowIndex);
  }

  onUpdateEdit(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    const field = group.rows[rowIndex].label;
    let payload: any = {};

    if (field === 'Password') {
      if (this.inputValues.newPassword === this.inputValues.confirmPassword) {
        payload.password = this.inputValues.newPassword;
      } else {
        alert('Passwords do not match.');
        return;
      }
    } else if (field === 'Name') {
      payload.firstName = this.inputValues.firstName;
      payload.lastName = this.inputValues.lastName;
    } else {
      const row = group.rows[rowIndex];
      if (!row || !row.payloadKey) {
        console.error(`Unknown field: ${field}`);
        return;
      }
      payload[row.payloadKey] = this.inputValues.value;
    }

    this.updateUserProfileMutation
      .mutateAsync(payload)
      .then(() => this.userProfileQuery.refetch())
      .catch((err) => console.error('Failed to update user profile:', err))
      .finally(() => {
        this.onCancelEdit();
      });
  }

  onCancelEdit(): void {
    this.editingGroupId = null;
    this.editingRowIndex = null;
    this.isEditingAny = false;
    this.inputValues = {};
  }

  onLinkClick(clickedItem: LinkItem): void {
    this.links.forEach((link) => (link.active = link.id === clickedItem.id));
    this.scrollToSection(clickedItem.id);
  }

  trackByGroupId(_: number, group: SettingsGroup): string {
    return group.id;
  }

  // Private methods
  private initializeComputedRows(): void {
    this.settingsGroups.forEach((group) => {
      this.computedRows[group.id] = computed(() => this.computeRows(group));
    });
  }

  private computeRows(group: SettingsGroup): [string, string][] {
    const profile = this.userProfileQuery.data();
    return group.rows.map((row) => [row.label, row.getValue(profile) ?? '']);
  }

  private scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id '${id}' not found.`);
    }
  }

  private initializeInputValues(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    const fieldName = group.rows[rowIndex].label;
    const currentValue = this.computedRows[groupId]()[rowIndex][1];

    if (fieldName === 'Password') {
      this.inputValues = { newPassword: '', confirmPassword: '' };
    } else if (fieldName === 'Name') {
      const nameParts = currentValue.split(' ');
      this.inputValues = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      };
    } else {
      this.inputValues = { value: currentValue };
    }
  }

  protected isEditingGroup(groupId: string): boolean {
    return this.editingGroupId === groupId;
  }
}
