import { LoginFormComponent } from './login-form.component';

import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@eDB/client-auth';
import { FormUtilsService } from '@eDB/shared-utils';
import { NotificationService } from 'carbon-components-angular';

import { Credentials, LoginResponse } from '../../types/login.types';

describe('LoginFormComponent (Standalone)', () => {
  let component: LoginFormComponent;
  let fixture: any;

  /**
   * We'll keep references to the actual `mutate` spy and the object returned by `authService.loginMutation`.
   * That way, we can reliably check how many times it's called and with what arguments.
   */
  let mutateSpy: ReturnType<typeof vi.fn>;
  let loginMutationObject: { mutate: ReturnType<typeof vi.fn> };

  // Mocked dependencies
  const mockRouter = {
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
  };

  const mockActivatedRoute = {
    snapshot: { queryParams: {} },
  };

  const mockNotificationService = {
    showToast: vi.fn(),
  };

  const mockAuthService = {
    loginMutation: vi.fn(), // We'll define the .mockReturnValue in beforeEach
    handleLogin: vi.fn(),
  };

  const mockFormUtilsService = {
    createFormGroup: vi.fn(),
    isFieldInvalid: vi.fn(),
    getErrorMessage: vi.fn(),
  };

  beforeEach(async () => {
    // Create a stable spy for mutate each time
    mutateSpy = vi.fn();
    // The object that loginMutation() should return
    loginMutationObject = { mutate: mutateSpy };
    // Whenever loginMutation() is called, return the same object
    mockAuthService.loginMutation.mockReturnValue(loginMutationObject);

    // Provide a simple form with email/password
    mockFormUtilsService.createFormGroup.mockImplementation(() => {
      const fb = new FormBuilder();
      return fb.group({
        email: [''],
        password: [''],
      });
    });
    // Mark fields as never invalid in these tests (we'll manually check validity)
    mockFormUtilsService.isFieldInvalid.mockReturnValue(false);
    mockFormUtilsService.getErrorMessage.mockReturnValue('');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FormUtilsService, useValue: mockFormUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    // Verify we used FormUtilsService.createFormGroup once
    expect(mockFormUtilsService.createFormGroup).toHaveBeenCalledTimes(1);
  });

  it('should call mutate on valid form submission', () => {
    // Mock credentials & response
    const mockCredentials: Credentials = {
      email: 'test@test.com',
      password: 'test123',
    };
    const mockResponse: LoginResponse = {
      token: 'mockToken',
      message: 'Login successful',
      user: {
        id: 1,
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        country: 'USA',
        role: 2,
      },
    };

    // Make mutateSpy simulate a successful login
    mutateSpy.mockImplementation((_, { onSuccess }) => {
      onSuccess(mockResponse);
    });

    // Fill out form with valid data
    component.loginForm.setValue(mockCredentials);
    component.loginForm.updateValueAndValidity();

    // Ensure the form is valid
    expect(component.loginForm.valid).toBe(true);

    // Submit
    component.onSubmit();

    // mutate() should have been called with credentials
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(mockCredentials, expect.any(Object));

    // Check that handleLogin, router.navigateByUrl, and showToast were invoked
    expect(mockAuthService.handleLogin).toHaveBeenCalledWith(
      mockResponse.token,
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    expect(mockNotificationService.showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Success',
      }),
    );
  });

  it('should show an error notification on login failure', () => {
    const mockCredentials: Credentials = {
      email: 'test@test.com',
      password: 'wrongPassword',
    };
    const mockError = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Invalid credentials' },
    });

    // mutateSpy simulates a failed login
    mutateSpy.mockImplementation((_, { onError }) => {
      onError(mockError);
    });

    component.loginForm.setValue(mockCredentials);
    component.loginForm.updateValueAndValidity();
    expect(component.loginForm.valid).toBe(true);

    component.onSubmit();

    // mutate() should have been called
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(mockCredentials, expect.any(Object));

    // Check error notification
    expect(mockNotificationService.showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Login Failed',
      }),
    );
  });

  it('should navigate to the register page on button click', () => {
    component.navigateToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register']);
  });
});
