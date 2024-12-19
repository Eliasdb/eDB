import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiIconComponent } from '../../icon/icon.component';
import { UiLoadingSpinnerComponent } from '../../loading/loading-spinner.component';
import { UiButtonComponent } from './button.component';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        UiLoadingSpinnerComponent,
        UiIconComponent,
        UiButtonComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default inputs', () => {
    // Verify default values for inputs
    expect(component.type()).toBe('button');
    expect(component.variant()).toBe('primary');
    expect(component.size()).toBe('lg');
    expect(component.disabled()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(component.icon()).toBeUndefined();
    expect(component.isExpressive()).toBe(false);
    expect(component.fullWidth()).toBe(false);
  });

  it('should emit buttonClick when clicked', () => {
    const emitSpy = vi.spyOn(component.buttonClick, 'emit'); // Spy on the emit method

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit buttonClick when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.buttonClick, 'emit'); // Spy on the emit method

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should render an icon when icon is set and not loading', () => {
    fixture.componentRef.setInput('icon', 'faMinus');
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(UiIconComponent));
    expect(icon).toBeTruthy();
  });

  it('should not render an icon when loading', () => {
    fixture.componentRef.setInput('icon', 'test-icon');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(UiIconComponent));
    expect(icon).toBeFalsy();
  });

  it('should render a loading spinner when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(UiLoadingSpinnerComponent),
    );
    expect(spinner).toBeTruthy();
  });

  it('should apply full-width class when fullWidth is true', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList).toContain('full-width');
  });

  it('should disable the button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });
});
