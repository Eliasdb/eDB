import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiTextAreaComponent } from './text-area.component';

describe('UiTextAreaComponent', () => {
  let component: UiTextAreaComponent;
  let fixture: ComponentFixture<UiTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputModule,
        FormsModule,
        ReactiveFormsModule,
        UiTextAreaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    fixture.componentRef.setInput('label', 'Textarea Label');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(
      By.css('cds-textarea-label'),
    );
    expect(labelElement.nativeElement.textContent.trim()).toContain(
      'Textarea Label',
    );
  });

  it('should update the value on input event', () => {
    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    textareaElement.value = 'Test value';
    textareaElement.dispatchEvent(new Event('input'));

    expect(component.value).toBe('Test value');
  });

  it('should call onTouched when the textarea loses focus', () => {
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    textareaElement.dispatchEvent(new Event('blur'));

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    expect(textareaElement.disabled).toBeTruthy();
  });

  it('should display helper text', () => {
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(
      By.css('cds-textarea-label'),
    );
    expect(labelElement.attributes['ng-reflect-helper-text']).toBe(
      'Helper text',
    );
  });

  it('should display invalid text when invalid is true', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('invalidText', 'Invalid input');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(
      By.css('cds-textarea-label'),
    );
    expect(labelElement.attributes['ng-reflect-invalid-text']).toBe(
      'Invalid input',
    );
  });

  it('should apply readonly attribute', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.readOnly).toBeTruthy();
  });

  it('should update rows and columns', () => {
    fixture.componentRef.setInput('rows', 10);
    fixture.componentRef.setInput('cols', 50);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.rows).toBe(10);
    expect(textareaElement.cols).toBe(50);
  });

  it('should update theme', () => {
    fixture.componentRef.setInput('theme', 'light');
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    expect(textareaElement.getAttribute('ng-reflect-theme')).toBe('light');
  });
});
