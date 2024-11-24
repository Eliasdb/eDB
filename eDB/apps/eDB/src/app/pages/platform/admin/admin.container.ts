import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiContentSwitcherComponent, UiTableComponent } from '@eDB/shared-ui';

@Component({
  standalone: true,
  selector: 'platform-admin',
  imports: [CommonModule, UiContentSwitcherComponent, UiTableComponent],
  template: `
    <ui-content-switcher [sections]="['First Section', 'Second Section']">
      <!-- First Section: Users Table -->
      <div [attr.section1]="''">
        <ui-table
          [title]="'User Management'"
          [description]="'Manage users and their roles.'"
          [users]="users"
          [pageLength]="10"
          [totalDataLength]="users.length"
          (rowDeleted)="deleteUser($event)"
          (roleChanged)="updateUserRole($event)"
        ></ui-table>
      </div>

      <!-- Second Section: Subscriptions -->
      <div [attr.section2]="''">
        <h2>Subscriptions</h2>
        <p>Manage your subscriptions here.</p>
      </div>
    </ui-content-switcher>
  `,
})
export class AdminContainer {
  users = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      country: 'USA',
      role: 'User',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      country: 'Canada',
      role: 'Admin',
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 4,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 5,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 6,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 7,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 8,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 9,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },

    {
      id: 10,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },
    {
      id: 11,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      country: 'UK',
      role: 'PremiumUser',
    },
  ];

  deleteUser(userId: number): void {
    console.log(`Deleting user with ID: ${userId}`);
    this.users = this.users.filter((user) => user.id !== userId);
  }

  updateUserRole({ id, newRole }: { id: number; newRole: string }): void {
    console.log(`Updating user with ID: ${id} to role: ${newRole}`);
    const user = this.users.find((user) => user.id === id);
    if (user) {
      user.role = newRole;
    }
  }
}
