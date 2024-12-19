import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiPlatformOverflowMenuComponent } from '../../navigation/overflow-menu/overflow-menu.component';
import { UiPlatformHeaderComponent } from './platform-header.component';

describe('UiPlatformHeaderComponent', () => {
  let component: UiPlatformHeaderComponent;
  let fixture: ComponentFixture<UiPlatformHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderModule,
        UiPlatformOverflowMenuComponent,
        UiPlatformHeaderComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiPlatformHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default brand name', () => {
    const header = fixture.debugElement.query(By.css('cds-header'));
    const nameAttr = header.attributes['ng-reflect-name']; // Check the `name` attribute
    expect(nameAttr).toBe('eDB'); // Validate the value
  });

  it('should display the navigation links', () => {
    const links = [
      { id: 'home', label: 'Home', isCurrentPage: true },
      { id: 'about', label: 'About', isCurrentPage: false },
    ];

    fixture.componentRef.setInput('navigationLinks', links);
    fixture.detectChanges();

    const linkElements = fixture.debugElement.queryAll(
      By.css('cds-header-item'),
    );
    expect(linkElements.length).toBe(2);
    expect(linkElements[0].nativeElement.textContent.trim()).toBe('Home');
    expect(linkElements[1].nativeElement.textContent.trim()).toBe('About');
  });

  it('should emit linkClick when a navigation link is clicked', () => {
    const links = [
      { id: 'home', label: 'Home', isCurrentPage: true },
      { id: 'about', label: 'About', isCurrentPage: false },
    ];

    fixture.componentRef.setInput('navigationLinks', links);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.linkClick, 'emit');
    const linkElement = fixture.debugElement.query(By.css('cds-header-item'));
    linkElement.triggerEventHandler('click', {});

    expect(emitSpy).toHaveBeenCalledWith('home');
  });

  it('should emit hamburgerToggle when the hamburger menu is clicked', () => {
    fixture.componentRef.setInput('hasHamburger', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.hamburgerToggle, 'emit');
    const hamburger = fixture.debugElement.query(By.css('cds-hamburger'));
    hamburger.triggerEventHandler('click', {});

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should display the overflow menu with the correct options', () => {
    const menuOptions = [
      { id: 'profile', label: 'Profile' },
      { id: 'logout', label: 'Logout' },
    ];

    // Set the required input
    fixture.componentRef.setInput('menuOptions', menuOptions);
    fixture.detectChanges();

    const menuComponent = fixture.debugElement.query(
      By.directive(UiPlatformOverflowMenuComponent),
    );
    expect(menuComponent).toBeTruthy();

    // Call the function to retrieve the current value
    expect(menuComponent.componentInstance.menuOptions()).toEqual(menuOptions);
  });

  it('should emit menuOptionSelected when an overflow menu option is selected', () => {
    const menuOptions = [
      { id: 'profile', label: 'Profile' },
      { id: 'logout', label: 'Logout' },
    ];

    fixture.componentRef.setInput('menuOptions', menuOptions);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.menuOptionSelected, 'emit');
    const menuComponent = fixture.debugElement.query(
      By.directive(UiPlatformOverflowMenuComponent),
    );

    menuComponent.triggerEventHandler('menuOptionSelected', 'logout');

    expect(emitSpy).toHaveBeenCalledWith('logout');
  });
});
