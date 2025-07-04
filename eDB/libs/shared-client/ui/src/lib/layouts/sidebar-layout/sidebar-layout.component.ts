import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';

@Component({
  selector: 'ui-sidebar-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
  ],
  template: `
    <mat-drawer-container class="h-[calc(100dvh-5rem)]" [hasBackdrop]="false">
      <!-- LEFT NAV / SIDEBAR -->
      <mat-drawer
        #leftNav
        class="bg-white text-white"
        [mode]="leftMode"
        [(opened)]="leftOpen"
      >
        <ng-container
          *ngTemplateOutlet="sidebarTpl ? sidebarTpl : noSidebar"
        ></ng-container>
      </mat-drawer>

      <!-- MAIN CONTENT (with optional header) -->
      <mat-drawer-content>
        <ng-container *ngIf="headerTpl" class="bg-white">
          <ng-container *ngTemplateOutlet="headerTpl"></ng-container>
        </ng-container>

        <ng-container *ngTemplateOutlet="mainTpl"></ng-container>
      </mat-drawer-content>

      <!-- RIGHT CONTEXT PANEL (optional) -->
      <ng-content select="[endPanel]"></ng-content>

      <ng-template #noSidebar>
        <p class="p-4 text-gray-400 text-sm">No sidebar provided.</p>
      </ng-template>
    </mat-drawer-container>
  `,
})
export class UiSidebarLayoutComponent {
  /* drawer control */
  @Input() leftMode: 'over' | 'side' = 'side';
  @Input() leftOpen = false;

  /* content slots */
  @ContentChild('sidebar', { static: false }) sidebarTpl?: TemplateRef<any>;
  @ContentChild('header', { static: false }) headerTpl?: TemplateRef<any>;
  @ContentChild('main', { static: false }) mainTpl!: TemplateRef<any>;

  /* expose a handle if parents need to toggle */
  @ViewChild(MatDrawer, { static: true }) drawer!: MatDrawer;
}
