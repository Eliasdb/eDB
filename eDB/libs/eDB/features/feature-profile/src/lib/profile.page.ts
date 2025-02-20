import { Component, computed, inject, Signal } from '@angular/core';
import {
  CustomModalService,
  UiSelectComponent,
  UiSidenavComponent,
  UiStructuredListComponent,
} from '@eDB/shared-ui';

import { ProfileService } from '@eDB/client-profile';

import { NotificationService } from 'carbon-components-angular';
import { MODAL_CONFIG, settingsGroups } from './profile.page.config';
import { LinkItem } from './types/linkitem.type';
import { SettingsGroup } from './types/settings.type';

@Component({
  selector: 'platform-settings',
  imports: [UiSidenavComponent, UiStructuredListComponent, UiSelectComponent],
  template: `
    <section class="settings-page">
      <!-- Sidenav area -->
      <section class="sidenav">
        <!-- Desktop version: show the original sidenav -->
        <div class="sidenav-desktop">
          <h3 class="profile-title">Profile</h3>
          <ui-sidenav
            [links]="links"
            (linkClick)="onLinkClick($event)"
          ></ui-sidenav>
        </div>

        <!-- Mobile version: show a select instead -->
        <div class="sidenav-mobile">
          <h3 class="profile-title">Profile</h3>
          <ui-select
            [options]="selectOptions"
            [model]="selectedLink"
            (valueChange)="onSelectChange($event)"
            placeholder="Select section"
          >
          </ui-select>
        </div>
      </section>

      <!-- Settings list area -->
      <section class="settings-container" #settingsContainer>
        @for (group of settingsGroups; track group.id) {
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
            [uneditedMode]="true"
            [id]="group.id"
            [skeleton]="isLoading()"
          ></ui-structured-list>
        }
        <div class="spacer"></div>
      </section>
    </section>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  // Existing properties...
  settingsGroups = settingsGroups;
  links: LinkItem[] = settingsGroups.map((g) => ({
    id: g.id,
    label: g.header,
    icon: g.headerIcon,
    active: false,
  }));

  // Computed rows, editing states, etc...
  computedRows: { [groupId: string]: Signal<[string, string][]> } = {};
  editingGroupId: string | null = null;
  editingRowIndex: number | null = null;
  isEditingAny = false;
  inputValues: any = {};

  // ---- New properties for the mobile select ----
  // Options for the select: each option has a value and label.
  selectOptions: Array<{ value: string; label: string }> = this.links.map(
    (link) => ({
      value: link.id,
      label: link.label,
    }),
  );
  // The current selected link. Default to the first link if available.
  selectedLink: string = this.links.length > 0 ? this.links[0].id : '';

  // ... your service injections and constructor, etc.
  private profileService = inject(ProfileService);
  private modalUtils = inject(CustomModalService);
  private notificationService = inject(NotificationService);

  private userProfileQuery = this.profileService.fetchUserProfile();
  protected isLoading = this.profileService.fetchUserProfile().isLoading;

  private updateUserProfileMutation = this.profileService.updateUserProfile();

  constructor() {
    this.initializeComputedRows();
  }

  ngOnInit(): void {
    // Only add the no-scroll class if the screen width is less than 768px
    if (window.innerWidth < 768) {
      document.body.classList.add('no-scroll');
    }
  }

  ngOnDestroy(): void {
    // Remove the no-scroll class if it was added
    if (window.innerWidth < 768) {
      document.body.classList.remove('no-scroll');
    }
  }

  // SIDENAV / SELECT HANDLERS

  // Original sidenav click handler (for desktop)
  onLinkClick(clickedItem: LinkItem): void {
    this.links.forEach((link) => (link.active = link.id === clickedItem.id));
    const element = document.getElementById(clickedItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id '${clickedItem.id}' not found.`);
    }
  }

  onSelectChange(newValue: string): void {
    this.selectedLink = newValue;
    // Update the active state of links if needed.
    // this.links.forEach((link) => (link.active = link.id === newValue));

    const element = document.getElementById(newValue);

    if (element) {
      // If the sections are inside a scrollable container:
      const container = document.querySelector('.settings-container');
      const headerOffset =
        15 * parseFloat(getComputedStyle(document.documentElement).fontSize); // 3rem in px
      if (container) {
        // Calculate the offset from the container top
        const offset =
          element.getBoundingClientRect().top +
          container.scrollTop -
          headerOffset;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        // Fallback to default scrollIntoView with a top margin adjustment via CSS (if set)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      console.warn(`Element with id '${newValue}' not found.`);
    }
  }

  // STRUCTURED LIST HANDLERS (existing code)
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
        break;
      }
      default:
        this.inputValues = { value: currentValue };
        break;
    }
  }

  onActionClick(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.header === 'Offboarding') {
      // For deleting the user account, get the profile data.
      this.openDeleteConfirmationModal();
    } else {
      // For editing fields
      if (this.isEditingAny) return;
      this.editingGroupId = groupId;
      this.editingRowIndex = rowIndex;
      this.isEditingAny = true;
      this.initializeInputValues(groupId, rowIndex);
    }
  }

  openDeleteConfirmationModal() {
    const profile = this.userProfileQuery.data();
    if (!profile) {
      console.error('No profile data available.');
      return;
    }
    this.modalUtils.openModal({
      ...MODAL_CONFIG.deactivateAccount(profile.firstName),
      onSave: () => this.handleDeactivateAccount(profile.id),
    });
  }

  // Handle deletion of the user account (implement your deletion logic here)
  handleDeactivateAccount(userId: string | number): void {
    console.log('Deleting user account with ID:', userId);
    // Add your deletion logic here (e.g., call a service to delete the account)
  }

  onUpdateEdit(groupId: string, rowIndex: number): void {
    const group = this.settingsGroups.find((g) => g.id === groupId);
    if (!group) return;

    const row = group.rows[rowIndex];
    const field = row.label;
    const payload: any = {};

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
        break;
      }
      default:
        if (!row.payloadKey) {
          console.error(`Unknown field: ${field}`);
          return;
        }
        payload[row.payloadKey] = this.inputValues.value;
        break;
    }

    this.updateUserProfileMutation.mutate(payload, {
      onSuccess: () => {
        console.log('User profile updated successfully', payload);
        this.notificationService.showNotification({
          type: 'success',
          title: 'Success - ',
          message: 'User profile updated successfully!',
          duration: 4000,
        });
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
