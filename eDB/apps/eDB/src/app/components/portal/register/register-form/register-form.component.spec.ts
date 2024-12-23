import { RegisterFormComponent } from './register-form.component';

import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@eDB/platform-services';
import { FormUtilsService } from '@eDB/shared-utils';
import { NotificationService } from 'carbon-components-angular';

import { User } from '../../../../models/user.model';

describe('RegisterFormComponent (Standalone)', () => {
  let fixture: any;
  let component: RegisterFormComponent;

  // We'll keep a reference to the actual `mutate` spy and the object returned by `authService.registerMutation`.
  let mutateSpy: ReturnType<typeof vi.fn>;
  let registerMutationObject: { mutate: ReturnType<typeof vi.fn> };

  // Mocked dependencies
  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockNotificationService = {
    showToast: vi.fn(),
  };

  const mockAuthService = {
    registerMutation: vi.fn(),
  };

  const mockFormUtilsService = {
    createFormGroup: vi.fn(),
    isFieldInvalid: vi.fn(),
    getErrorMessage: vi.fn(),
  };

  beforeEach(async () => {
    // Create a stable spy for mutate each time
    mutateSpy = vi.fn();
    // The object that registerMutation() should return
    registerMutationObject = { mutate: mutateSpy };
    // Make registerMutation() always return the same object
    mockAuthService.registerMutation.mockReturnValue(registerMutationObject);

    // Provide a simple form builder
    mockFormUtilsService.createFormGroup.mockImplementation(() => {
      const fb = new FormBuilder();
      return fb.group({
        // Typically your register form might have these fields:
        firstName: [''],
        lastName: [''],
        email: [''],
        password: [''],
        country: [''],
        state: [''],
        company: [''],
      });
    });

    // Mark fields as never invalid in these tests
    mockFormUtilsService.isFieldInvalid.mockReturnValue(false);
    mockFormUtilsService.getErrorMessage.mockReturnValue('');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterFormComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: FormUtilsService, useValue: mockFormUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
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
    // Confirm we called formUtilsService.createFormGroup
    expect(mockFormUtilsService.createFormGroup).toHaveBeenCalledTimes(1);
  });

  it('should call registerMutation on valid form submission', () => {
    // Mock user data
    const mockUser: User = {
      firstName: 'john',
      lastName: 'doe',
      email: 'john@example.com',
      password: 'secretPass',
      country: 'belgium',
      state: 'oost-vlaanderen',
      company: 'edb.com',
    };

    // Simulate success from mutate
    mutateSpy.mockImplementation((_, { onSuccess }) => {
      onSuccess(); // no particular payload on success
    });

    // Fill out form with valid data
    component.registerForm.setValue(mockUser);
    component.registerForm.updateValueAndValidity();
    expect(component.registerForm.valid).toBe(true);

    // Submit
    component.onSubmit();

    // mutate() should have been called exactly once with our user
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(mockUser, expect.any(Object));

    // Check that router.navigate was invoked
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);

    // Check success toast
    expect(mockNotificationService.showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Success',
      }),
    );
  });

  it('should show an error notification on register failure', () => {
    const mockUser: User = {
      firstName: 'jane',
      lastName: 'doe',
      email: 'jane@example.com',
      password: 'badPass',
      country: 'belgium',
      state: 'oost-vlaanderen',
      company: 'edb.com',
    };
    const mockError = {
      error: { message: 'Registration failed' },
    };

    // mutateSpy simulates an error
    mutateSpy.mockImplementation((_, { onError }) => {
      onError(mockError);
    });

    component.registerForm.setValue(mockUser);
    component.registerForm.updateValueAndValidity();
    expect(component.registerForm.valid).toBe(true);

    component.onSubmit();

    // mutate() should have been called once
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(mockUser, expect.any(Object));

    // Check error toast
    expect(mockNotificationService.showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Error',
      }),
    );
  });
});
