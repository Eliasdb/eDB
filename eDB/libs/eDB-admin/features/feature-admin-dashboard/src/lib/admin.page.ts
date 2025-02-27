import {
  ApplicationsCollectionContainer,
  UsersCollectionContainer,
} from './components';

import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { AdminBooksCollectionContainer } from './components/admin-books/admin-books-collection-container/admin-books-collection.container';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminStatsContainer } from './components/admin-stats-container/admin-stats.container';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page">
    <section>
      <h1 class="text-3xl">Admin</h1>
    </section>
    <section class="collection-title">
      <h3>Books</h3>
      <div>
        <button mat-raised-button color="accent">Add book</button>
      </div>
    </section>
    <div class="example-container mat-elevation-z8">
      <div class="example-table-container">
        <table mat-table [dataSource]="test" class="mat-elevation-z8" matSort>
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
              <mat-checkbox> </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox> </mat-checkbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
            <td mat-cell *matCellDef="let row">{{ row.id }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
          </ng-container>

          <ng-container matColumnDef="genre">
            <th mat-header-cell *matHeaderCellDef>Genre</th>
            <td mat-cell *matCellDef="let row">{{ row.genre }}</td>
          </ng-container>

          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let row">{{ row.author }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">{{ row.status }}</td>
          </ng-container>

          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef>Year</th>
            <td mat-cell *matCellDef="let row">{{ row.publishedDate }}</td>
          </ng-container>

          <ng-container matColumnDef="edit">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <div class="flex justify-center">
                <mat-icon>edit</mat-icon>
              </div>
            </td>
          </ng-container>

          <!-- Created Column -->
          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns; sticky: true"
          ></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
    <admin-stats-container />
    <ui-content-switcher [options]="['Platform', 'Webshop']">
      <ng-container section1>
        <section class="flex flex-col gap-4">
          <platform-admin-applications-collection></platform-admin-applications-collection>
          <platform-admin-users-collection></platform-admin-users-collection>
        </section>
      </ng-container>
      <ng-container section2>
        <nav>
          <div class="nav-center">
            <button
              mat-raised-button
              (click)="drawer.toggle()"
              type="button"
              class="toggle-btn"
            >
              <img
                src="https://www.svgrepo.com/show/529002/hamburger-menu.svg"
                alt="toggle-btn"
                width="20"
              />
            </button>
          </div>
        </nav>
        <mat-drawer-container class="example-container">
          <mat-drawer #drawer [mode]="mode.value" [autoFocus]="false"
            ><admin-sidebar (itemSelected)="switchDrawerContent($event)"
          /></mat-drawer>
          <mat-select #mode value="push" />
          <mat-drawer-content>
            <div class="content">
              <ng-container [ngSwitch]="currentView()">
                <admin-books-collection-container
                  *ngSwitchCase="'books'"
                ></admin-books-collection-container>
                <platform-admin-applications-collection
                  *ngSwitchCase="'order-overview'"
                ></platform-admin-applications-collection>
              </ng-container>
            </div>
          </mat-drawer-content>
        </mat-drawer-container>
      </ng-container>
    </ui-content-switcher>
  </section>`,
  imports: [
    UiContentSwitcherComponent,
    UsersCollectionContainer,
    ApplicationsCollectionContainer,
    MatSidenavModule,
    MatSelectModule,
    AdminSidebarComponent,
    CommonModule,
    AdminStatsContainer,
    AdminBooksCollectionContainer,

    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  styleUrls: ['admin.page.scss'],
})
export class AdminPage {
  currentView = signal<'books' | 'order-overview'>('books');
  @ViewChild('drawer') drawer!: MatDrawer;

  switchDrawerContent(newContent: 'books' | 'order-overview') {
    console.log(`Switching view to: ${newContent}`);
    this.currentView.set(newContent);
    this.drawer.toggle();
  }

  test = [
    {
      id: 6,
      photoUrl: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
      description:
        'In quos et unde et id velit eum placeat molestias et qui corporis.',
      userId: null,
      title: "Verlie O'Conner DVM",
      genre: 'Fantasy',
      author: 'Luz Anderson',
      status: 'available',
      publishedDate: '1985',
    },
    {
      id: 7,
      photoUrl: 'https://example.com/image2.jpg',
      description: 'A sample description for the second book.',
      userId: null,
      title: 'Sample Book Title',
      genre: 'Mystery',
      author: 'Jane Doe',
      status: 'checked out',
      publishedDate: '1992',
    },
    {
      id: 8,
      photoUrl: 'https://example.com/image3.jpg',
      description: 'Another sample description for the third book.',
      userId: 3,
      title: 'Another Book Title',
      genre: 'Science Fiction',
      author: 'John Smith',
      status: 'available',
      publishedDate: '2001',
    },
  ];

  // Example usage: log the array to the console

  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'genre',
    'author',
    'status',
    'year',
    'edit',
  ];
}
