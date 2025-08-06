import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldDefinition } from '../../models/field-definition.model';
import { FormUtilsService } from './form-utils.service';

describe('FormUtilsService', () => {
  let service: FormUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormUtilsService],
    });
    service = TestBed.inject(FormUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createFormGroup', () => {
    const createFields = (): FieldDefinition[] => [
      {
        controlName: 'name',
        label: 'Name',
        controlType: 'text',
        validators: [],
        errorMessages: { required: 'Name is required' },
      },
      {
        controlName: 'email',
        label: 'Email',
        controlType: 'email',
        validators: [],
        errorMessages: {
          required: 'Email is required',
          email: 'Invalid email',
        },
      },
    ];

    it('should create a FormGroup with specified fields', () => {
      const fields = createFields();
      const formGroup = service.createFormGroup(fields);

      expect(formGroup.contains('name')).toBe(true);
      expect(formGroup.contains('email')).toBe(true);
    });
  });

  describe('isFieldInvalid', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormBuilder().group({
        name: [''],
      });
    });

    it('should return true for invalid and touched control', () => {
      formGroup.get('name')?.setErrors({ required: true });
      formGroup.get('name')?.markAsTouched();

      expect(service.isFieldInvalid(formGroup, 'name')).toBe(true);
    });

    it('should return false for valid control', () => {
      formGroup.get('name')?.setValue('Valid Name');

      expect(service.isFieldInvalid(formGroup, 'name')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormBuilder().group({
        email: [''],
      });
    });

    const errorMessages = {
      required: 'Email is required',
    };

    it('should return correct error message for a control', () => {
      formGroup.get('email')?.setErrors({ required: true });

      expect(service.getErrorMessage(formGroup, 'email', errorMessages)).toBe(
        'Email is required',
      );
    });

    it('should return an empty string for unmatched error messages', () => {
      formGroup.get('email')?.setErrors({ minlength: { requiredLength: 5 } });

      expect(service.getErrorMessage(formGroup, 'email', errorMessages)).toBe(
        '',
      );
    });
  });
});
