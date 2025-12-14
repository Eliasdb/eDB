import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContentSwitcherModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiContentSwitcherComponent } from './content-switcher.component';

describe('UiContentSwitcherComponent', () => {
  let component: UiContentSwitcherComponent;
  let fixture: ComponentFixture<UiContentSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentSwitcherModule, UiContentSwitcherComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiContentSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render options dynamically', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(
      By.css('button[cdsContentOption]'),
    );
    expect(buttons.length).toBe(options.length);

    buttons.forEach((button, index) => {
      expect(button.nativeElement.textContent.trim()).toBe(options[index]);
    });
  });

  it('should highlight the active section', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    fixture.componentRef.setInput('options', options);
    component.activeSection.set(1); // Set active section to the second option
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(
      By.css('button[cdsContentOption]'),
    );
    buttons.forEach((button, index) => {
      const isSelected = button.nativeElement.classList.contains(
        'bx--content-switcher--selected',
      );
      expect(isSelected).toBe(index === 1);
    });
  });

  it('should emit activeSectionChange when a new section is selected', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const activeSectionChangeSpy = vi.spyOn(
      component.activeSectionChange,
      'emit',
    );

    component.onSelectionChange(2); // Trigger selection
    fixture.detectChanges();

    expect(activeSectionChangeSpy).toHaveBeenCalledWith(2);
    expect(component.activeSection()).toBe(2);
  });
});
