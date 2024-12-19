import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons'; // Import solidIcons
import { vi } from 'vitest';
import { UiIconComponent } from './icon.component';

describe('UiIconComponent', () => {
  let component: UiIconComponent;
  let fixture: ComponentFixture<UiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, UiIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default icon if no name is provided', () => {
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon).toBeTruthy();
    expect(faIcon.componentInstance.icon).toEqual(solidIcons.faQuestionCircle); // Check the default icon
  });

  it('should display the correct icon when name is provided', () => {
    fixture.componentRef.setInput('name', 'faCheck');
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon).toBeTruthy();
    expect(faIcon.componentInstance.icon).toEqual(solidIcons.faCheck); // Check the provided icon
  });

  it('should apply the correct size', () => {
    fixture.componentRef.setInput('size', '2em');
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon.styles['font-size']).toBe('2em');
  });

  it('should apply the correct color', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon.styles['color']).toBe('red');
  });

  it('should add fa-border class when border is true', () => {
    fixture.componentRef.setInput('border', true);
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon.classes['fa-border']).toBeTruthy();
  });

  it('should add fa-fw and dynamic-icon classes when fixedWidth is true', () => {
    fixture.componentRef.setInput('fixedWidth', true);
    fixture.detectChanges();

    const faIcon = fixture.debugElement.query(By.css('fa-icon'));
    expect(faIcon.classes['fa-fw']).toBeTruthy();
    expect(faIcon.classes['dynamic-icon']).toBeTruthy();
  });

  it('should log an error if an invalid icon name is provided', () => {
    const consoleSpy = vi.spyOn(console, 'error');

    fixture.componentRef.setInput('name', 'invalidIcon');
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Icon "invalidIcon" not found.');
  });
});
