import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiTextInputComponent } from './input.component';

describe('UiTextInputComponent', () => {
  let component: UiTextInputComponent;
  let fixture: ComponentFixture<UiTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputModule,
        FormsModule,
        ReactiveFormsModule,
        UiTextInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    fixture.componentRef.setInput('label', 'Text Input Label');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('cds-text-label'));
    expect(labelElement.nativeElement.textContent.trim()).toContain(
      'Text Input Label',
    );
  });

  it('should update the value on input event', () => {
    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    inputElement.value = 'Test value';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.value).toBe('Test value');
  });

  it('should call onTouched when the input loses focus', () => {
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    inputElement.dispatchEvent(new Event('blur'));

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    fixture.componentRef.setInput('disabled', true);

    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.disabled).toBeTruthy();
  });

  it('should display helper text', () => {
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('cds-text-label'));
    expect(labelElement.attributes['ng-reflect-helper-text']).toBe(
      'Helper text',
    );
  });

  it('should display invalid text when invalid is true', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('invalidText', 'Invalid input');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('cds-text-label'));
    expect(labelElement.attributes['ng-reflect-invalid-text']).toBe(
      'Invalid input',
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

  it('should update theme', () => {
    fixture.componentRef.setInput('theme', 'light');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputElement.getAttribute('ng-reflect-theme')).toBe('light');
  });

  it('should update size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.getAttribute('size')).toBe('sm');
  });

  it('should update autocomplete attribute', () => {
    fixture.componentRef.setInput('autocomplete', 'username');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.getAttribute('autocomplete')).toBe('username');
  });
});
