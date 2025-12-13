import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiIconComponent } from '../../icon/icon.component';
import { UiIconButtonComponent } from './icon-button.component';

describe('UiIconButtonComponent', () => {
  let component: UiIconButtonComponent;
  let fixture: ComponentFixture<UiIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, UiIconComponent, UiIconButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIconButtonComponent);
    component = fixture.componentInstance;

    // Set required inputs before rendering
    fixture.componentRef.setInput('icon', 'faEdit');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the icon with the correct attributes', () => {
    fixture.componentRef.setInput('icon', 'faCheck');
    fixture.componentRef.setInput('iconSize', '24px');
    fixture.componentRef.setInput('iconColor', 'green');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(UiIconComponent));
    expect(icon).toBeTruthy();
    expect(icon.componentInstance.name()).toBe('faCheck'); // Call .name() to get the value
    expect(icon.componentInstance.size()).toBe('24px'); // Call .size() to get the value
    expect(icon.componentInstance.color()).toBe('green'); // Call .color() to get the value
  });

  it('should emit blur event when focus is lost', () => {
    const emitSpy = vi.spyOn(component.iconButtonBlur, 'emit');

    const button = fixture.debugElement.query(By.css('cds-icon-button'));
    button.triggerEventHandler('blur', {});

    expect(emitSpy).toHaveBeenCalled();
  });
});
