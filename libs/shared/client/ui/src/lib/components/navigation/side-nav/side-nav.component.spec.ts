import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiIconComponent } from '../../icon/icon.component';
import { UiSidenavComponent } from './side-nav.component';

describe('UiSidenavComponent', () => {
  let component: UiSidenavComponent;
  let fixture: ComponentFixture<UiSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavModule, UiIconComponent, UiSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided links', async () => {
    const testLinks = [
      { id: 'home', label: 'Home', icon: 'faHome' },
      { id: 'profile', label: 'Profile', icon: 'faUser', active: true },
      { id: 'logout', label: 'Logout', icon: 'faSignOutAlt' },
    ];

    fixture.componentRef.setInput('links', testLinks);
    fixture.detectChanges();
    await fixture.whenStable();

    const sidenavItems = fixture.nativeElement.querySelectorAll(
      'a.cds--side-nav__link',
    );

    expect(sidenavItems.length).toBe(testLinks.length);

    testLinks.forEach((link, index) => {
      const sidenavItem = sidenavItems[index];
      expect(sidenavItem.textContent.trim()).toContain(link.label);

      if (link.icon) {
        const icon = sidenavItem.querySelector('ui-icon');
        expect(icon).toBeTruthy();
        expect(icon.getAttribute('ng-reflect-name')).toBe(link.icon);
      }

      if (link.active) {
        expect(
          sidenavItem.classList.contains('cds--side-nav__item--active'),
        ).toBe(true);
      }
    });
  });

  it('should ensure cds-sidenav-item elements have correct href attributes', async () => {
    const testLinks = [
      { id: 'home', label: 'Home', icon: 'faHome' },
      { id: 'profile', label: 'Profile', icon: 'faUser', active: true },
      { id: 'logout', label: 'Logout', icon: 'faSignOutAlt' },
    ];

    fixture.componentRef.setInput('links', testLinks);
    fixture.detectChanges();
    await fixture.whenStable();

    // Query `cds-sidenav-item` elements
    const sidenavItems =
      fixture.nativeElement.querySelectorAll('cds-sidenav-item');

    // Assert the count matches
    expect(sidenavItems.length).toBe(testLinks.length);

    // Loop through each item and check the href attribute
    testLinks.forEach((link, index) => {
      const item = sidenavItems[index];
      const href = item.getAttribute('href');
      expect(href).toBe(`#${link.id}`); // Assert the href contains the correct value
    });
  });

  it('should emit linkClick when a link is clicked', async () => {
    const testLinks = [
      { id: 'home', label: 'Home', icon: 'faHome' },
      { id: 'profile', label: 'Profile', icon: 'faUser', active: true },
      { id: 'logout', label: 'Logout', icon: 'faSignOutAlt' },
    ];

    fixture.componentRef.setInput('links', testLinks);
    fixture.detectChanges();
    await fixture.whenStable();

    vi.spyOn(component.linkClick, 'emit');

    const sidenavItems =
      fixture.nativeElement.querySelectorAll('cds-sidenav-item');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    sidenavItems[1].dispatchEvent(clickEvent);

    expect(component.linkClick.emit).toHaveBeenCalledWith(testLinks[1]);
  });

  it('should prevent default behavior on link click', async () => {
    const testLinks = [
      { id: 'home', label: 'Home', icon: 'faHome' },
      { id: 'profile', label: 'Profile', icon: 'faUser', active: true },
      { id: 'logout', label: 'Logout', icon: 'faSignOutAlt' },
    ];

    fixture.componentRef.setInput('links', testLinks);
    fixture.detectChanges();
    await fixture.whenStable();

    const sidenavItems =
      fixture.nativeElement.querySelectorAll('cds-sidenav-item');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    sidenavItems[0].dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
