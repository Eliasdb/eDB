import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { AuthService } from '@eDB/platform-services';
import { NotificationService } from 'carbon-components-angular';

import { UiPlatformHeaderComponent } from '@eDB/shared-ui';
import { PlatformLayout } from './platform.layout';

describe('PlatformLayout', () => {
  let component: PlatformLayout;
  let fixture: any;

  // Mocked dependencies
  const mockRouter = {
    navigate: vi.fn().mockImplementation((routes: string[]) => {
      mockRouter.url = '/' + routes[0];
      return Promise.resolve(true);
    }),
    url: '/dashboard', // Initial URL
  };

  const mockNotificationService = {
    showToast: vi.fn(),
  };

  // Use BehaviorSubject to control isAdmin$ observable
  const isAdminSubject = new BehaviorSubject<boolean>(false);

  const mockAuthService = {
    isAdmin: vi.fn().mockReturnValue(isAdminSubject.asObservable()),
    getUserRole: vi.fn().mockReturnValue(of('user')),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformLayout, UiPlatformHeaderComponent], // Declare the header component
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformLayout);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  afterEach(() => {
    vi.clearAllMocks(); // Reset mocks after each test
    isAdminSubject.next(false); // Reset admin status
    mockRouter.url = '/dashboard'; // Reset router.url
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default navigationLinks and menuOptions', () => {
    expect(component.navigationLinks).toEqual([
      { id: 'dashboard', label: 'My eDB', isCurrentPage: true }, // Corrected to true
      { id: 'catalog', label: 'Catalog', isCurrentPage: false },
      { id: 'profile', label: 'Profile', isCurrentPage: false },
    ]);

    expect(component.menuOptions).toEqual([
      { id: 'dashboard', label: 'My eDB' },
      { id: 'profile', label: 'Profile' },
      { id: 'logout', label: 'Logout' },
    ]);
  });

  it('should add admin links when isAdmin$ emits true', () => {
    // Emit true to indicate the user is an admin
    isAdminSubject.next(true);
    fixture.detectChanges(); // Update bindings

    // Verify that admin links are added
    expect(component.navigationLinks).toContainEqual({
      id: 'admin',
      label: 'Admin',
      isCurrentPage: false,
    });

    expect(component.menuOptions).toContainEqual({
      id: 'admin',
      label: 'Admin',
    });
  });

  it('should remove admin links when isAdmin$ emits false', () => {
    // First, emit true to add admin links
    isAdminSubject.next(true);
    fixture.detectChanges();

    // Ensure admin links are present
    expect(component.navigationLinks).toContainEqual({
      id: 'admin',
      label: 'Admin',
      isCurrentPage: false,
    });

    expect(component.menuOptions).toContainEqual({
      id: 'admin',
      label: 'Admin',
    });

    // Now, emit false to remove admin links
    isAdminSubject.next(false);
    fixture.detectChanges();

    // Verify that admin links are removed
    expect(component.navigationLinks).not.toContainEqual({
      id: 'admin',
      label: 'Admin',
      isCurrentPage: false,
    });

    expect(component.menuOptions).not.toContainEqual({
      id: 'admin',
      label: 'Admin',
    });
  });

  it('should update current page based on router url', () => {
    // Mock router.url
    mockRouter.url = '/catalog';
    component.updateCurrentPage();

    expect(
      component.navigationLinks.find((link) => link.id === 'catalog')
        ?.isCurrentPage,
    ).toBe(true);
    expect(
      component.navigationLinks.find((link) => link.id === 'dashboard')
        ?.isCurrentPage,
    ).toBe(false);
    expect(
      component.navigationLinks.find((link) => link.id === 'profile')
        ?.isCurrentPage,
    ).toBe(false);
  });

  it('should navigate to a target when navigateTo is called', async () => {
    const target = 'catalog';
    await component.navigateTo(target); // Await the navigation

    expect(mockRouter.navigate).toHaveBeenCalledWith([target]);
    expect(
      component.navigationLinks.find((link) => link.id === target)
        ?.isCurrentPage,
    ).toBe(true);
  });

  it('should handle menu option selection and navigate to non-logout option', async () => {
    const optionId = 'profile';
    await component.handleMenuOption(optionId); // Await the navigation

    expect(mockRouter.navigate).toHaveBeenCalledWith([optionId]);
    expect(
      component.navigationLinks.find((link) => link.id === optionId)
        ?.isCurrentPage,
    ).toBe(true);
  });

  it('should handle menu option selection and perform logout', () => {
    const optionId = 'logout';
    component.handleMenuOption(optionId);

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(mockNotificationService.showToast).not.toHaveBeenCalled(); // Corrected expectation
  });

  it('should add admin links and update current page when user becomes admin and navigates to admin page', () => {
    // Emit admin status
    isAdminSubject.next(true);
    fixture.detectChanges();

    // Mock router.url to admin page
    mockRouter.url = '/admin';
    component.updateCurrentPage();

    // Verify admin link is marked as current page
    expect(
      component.navigationLinks.find((link) => link.id === 'admin')
        ?.isCurrentPage,
    ).toBe(true);
    // Verify other links are not current
    expect(
      component.navigationLinks.find((link) => link.id === 'dashboard')
        ?.isCurrentPage,
    ).toBe(false);
    expect(
      component.navigationLinks.find((link) => link.id === 'catalog')
        ?.isCurrentPage,
    ).toBe(false);
    expect(
      component.navigationLinks.find((link) => link.id === 'profile')
        ?.isCurrentPage,
    ).toBe(false);
  });

  it('should not add admin links multiple times', () => {
    // Emit admin status multiple times
    isAdminSubject.next(true);
    fixture.detectChanges();

    isAdminSubject.next(true);
    fixture.detectChanges();

    // Admin link should only appear once
    const adminLinks = component.navigationLinks.filter(
      (link) => link.id === 'admin',
    );
    expect(adminLinks.length).toBe(1);

    const adminMenuOptions = component.menuOptions.filter(
      (option) => option.id === 'admin',
    );
    expect(adminMenuOptions.length).toBe(1);
  });

  it('should not remove non-admin links when removing admin links', () => {
    // Add admin links
    isAdminSubject.next(true);
    fixture.detectChanges();

    // Remove admin links
    isAdminSubject.next(false);
    fixture.detectChanges();

    // Ensure other links are still present
    expect(component.navigationLinks).toContainEqual({
      id: 'dashboard',
      label: 'My eDB',
      isCurrentPage: true, // Corrected to true
    });
    expect(component.navigationLinks).toContainEqual({
      id: 'catalog',
      label: 'Catalog',
      isCurrentPage: false,
    });
    expect(component.navigationLinks).toContainEqual({
      id: 'profile',
      label: 'Profile',
      isCurrentPage: false,
    });
  });
});
