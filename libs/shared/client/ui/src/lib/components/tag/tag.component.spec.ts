import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagModule } from 'carbon-components-angular';
import { UiIconComponent } from '../icon/icon.component';
import { UiTagComponent } from './tag.component';

describe('UiTagComponent', () => {
  let fixture: ComponentFixture<UiTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagModule, UiTagComponent, UiIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTagComponent);
  });

  it('should render the tag with default inputs', () => {
    fixture.componentRef.setInput('label', 'Default Label');
    fixture.detectChanges();
    const tagElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-tag');

    expect(tagElement).toBeTruthy();
    expect(tagElement.classList).toContain('ui-tag');
    expect(tagElement.getAttribute('ng-reflect-type')).toBe('red');
    expect(tagElement.textContent?.trim()).toBe('Default Label');
  });

  it('should update the label when input is set', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const tagElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-tag');

    expect(tagElement.textContent?.trim()).toBe('Test Label');
  });

  it('should apply the correct type and size', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('type', 'green');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const tagElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-tag');

    expect(tagElement.getAttribute('ng-reflect-type')).toBe('green');
    expect(tagElement.getAttribute('ng-reflect-size')).toBe('sm');
  });

  it('should render the icon when input is set', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('icon', 'faPlus');
    fixture.detectChanges();

    const iconElement: HTMLElement =
      fixture.nativeElement.querySelector('ui-icon');

    expect(iconElement).toBeTruthy();
    expect(iconElement.getAttribute('ng-reflect-name')).toBe('faPlus');
  });

  it('should not render the icon when input is not set', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('icon', ''); // No icon provided
    fixture.detectChanges();

    const iconElement: HTMLElement =
      fixture.nativeElement.querySelector('ui-icon');

    expect(iconElement).toBeNull();
  });
});
