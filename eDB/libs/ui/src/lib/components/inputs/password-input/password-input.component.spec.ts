import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiPasswordInputComponent } from './password-input.component';

describe('UiPasswordInputComponent', () => {
  let component: UiPasswordInputComponent;
  let fixture: ComponentFixture<UiPasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputModule,
        FormsModule,
        ReactiveFormsModule,
        UiPasswordInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiPasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    fixture.componentRef.setInput('label', 'Password');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.cds--label')); // Querying the actual label element
    expect(labelElement).toBeTruthy(); // Ensure the element exists

    // Extract only the text content of the label element
    const textContent =
      labelElement.nativeElement.firstChild?.textContent.trim();
    expect(textContent).toBe('Password');
  });

  it('should update the value on input event', () => {
    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    inputElement.value = 'testPassword';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.value).toBe('testPassword');
  });

  it('should update the value and trigger onChange when the input changes', () => {
    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    const newValue = 'newPassword';
    inputElement.value = newValue;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value).toBe(newValue); // Verify the component's value is updated
  });

  it('should call onTouched when the input loses focus', () => {
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy); // Register a spy for the onTouched method

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    inputElement.dispatchEvent(new Event('blur'));

    expect(onTouchedSpy).toHaveBeenCalled(); // Verify the spy was called
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.disabled).toBeTruthy();
  });

  it('should display helper text', () => {
    fixture.componentRef.setInput('helperText', 'This is helper text');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(
      By.css('cds-password-label'),
    );
    expect(labelElement.attributes['ng-reflect-helper-text']).toBe(
      'This is helper text',
    );
  });

  it('should display invalid text when invalid is true', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('invalidText', 'Invalid password');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(
      By.css('cds-password-label'),
    );
    expect(labelElement.attributes['ng-reflect-invalid-text']).toBe(
      'Invalid password',
    );
  });

  it('should apply readonly attribute', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.readOnly).toBeTruthy();
  });

  it('should apply autocomplete attribute', () => {
    fixture.componentRef.setInput('autocomplete', 'new-password');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.autocomplete).toBe('new-password');
  });
});
