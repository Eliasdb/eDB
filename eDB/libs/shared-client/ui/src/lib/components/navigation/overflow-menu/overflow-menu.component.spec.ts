import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../../components/icon/icon.component';
import { UiPlatformOverflowMenuComponent } from './overflow-menu.component';

describe('UiPlatformOverflowMenuComponent', () => {
  let component: UiPlatformOverflowMenuComponent;
  let fixture: ComponentFixture<UiPlatformOverflowMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'home', component: UiPlatformOverflowMenuComponent },
          { path: 'profile', component: UiPlatformOverflowMenuComponent },
          { path: 'deleteUser', component: UiPlatformOverflowMenuComponent },
        ]),
        DialogModule,
        UiPlatformOverflowMenuComponent,
        UiIconComponent, // Import real UiIconComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPlatformOverflowMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render menu options dynamically', async () => {
    const testMenuOptions = [
      { id: 'home', label: 'Home' },
      { id: 'profile', label: 'Profile' },
      { id: 'logout', label: 'Logout' },
    ];

    // Set the input and trigger change detection
    fixture.componentRef.setInput('menuOptions', testMenuOptions);
    component.isMenuOpen = true; // Simulate opening the menu
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for async rendering if necessary

    // Query the dynamically created menu pane
    const pane = document.querySelector(
      'cds-overflow-menu-pane .cds--overflow-menu-options',
    );
    expect(pane).toBeTruthy();

    // Query the menu options within the pane
    const options = pane?.querySelectorAll('cds-overflow-menu-option');
    expect(options?.length).toBe(testMenuOptions.length);

    // Verify that the options have the correct labels
    testMenuOptions.forEach((option, index) => {
      const menuOption = options?.[index]?.querySelector('button');
      expect(menuOption?.textContent?.trim()).toBe(option.label);
    });
  });

  it('should emit menuOptionSelected when an option is clicked', async () => {
    const testMenuOptions = [
      { id: 'viewMore', label: 'View More' },
      { id: 'deleteUser', label: 'Delete User' },
    ];

    // Set the input and trigger change detection
    fixture.componentRef.setInput('menuOptions', testMenuOptions);
    component.isMenuOpen = true; // Simulate opening the menu
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for async rendering if necessary

    // Query the dynamically created menu pane
    const pane = document.querySelector(
      'cds-overflow-menu-pane .cds--overflow-menu-options',
    );
    expect(pane).toBeTruthy();

    // Query the menu options within the pane
    const options = pane?.querySelectorAll('cds-overflow-menu-option');
    expect(options?.length).toBe(testMenuOptions.length);

    // Simulate a click on the second menu option
    const secondOption = options?.[1]?.querySelector('button');
    expect(secondOption).toBeTruthy();

    vi.spyOn(component.menuOptionSelected, 'emit');

    // Dispatch a click event on the second option
    secondOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    // Verify the event emitter was called with the correct value
    expect(component.menuOptionSelected.emit).toHaveBeenCalledWith(
      'deleteUser',
    );
  });

  it('should render the custom trigger icon with correct properties', () => {
    fixture.componentRef.setInput('icon', 'faPlus');
    fixture.componentRef.setInput('iconSize', '2rem');
    fixture.componentRef.setInput('iconColor', 'blue');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('ui-icon'));

    // Ensure the icon exists in the DOM and verify attributes using nativeElement
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.outerHTML).toContain('ng-reflect-name="faPlus"');
    expect(icon.nativeElement.outerHTML).toContain('ng-reflect-size="2rem"');
    expect(icon.nativeElement.outerHTML).toContain('ng-reflect-color="blue"');
  });
});
