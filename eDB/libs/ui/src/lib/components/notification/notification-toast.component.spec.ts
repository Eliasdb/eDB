import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationModule } from 'carbon-components-angular';
import { UiNotificationToastComponent } from './notification-toast.component';

describe('UiNotificationToastComponent', () => {
  let component: UiNotificationToastComponent;
  let fixture: ComponentFixture<UiNotificationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationModule, UiNotificationToastComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiNotificationToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a toast notification when type is toast', async () => {
    fixture.componentRef.setInput('type', 'toast');
    fixture.detectChanges();
    await fixture.whenStable();

    const toastElement = fixture.nativeElement.querySelector('cds-toast');
    expect(toastElement).toBeTruthy();

    const title = toastElement?.querySelector(
      '.cds--toast-notification__title',
    );
    const subtitle = toastElement?.querySelector(
      '.cds--toast-notification__subtitle span',
    );
    const caption = toastElement?.querySelector(
      '.cds--toast-notification__caption',
    );
    const closeButton = toastElement?.querySelector(
      '.cds--toast-notification__close-button',
    );

    expect(title?.textContent).toContain('Default Title');
    expect(subtitle?.textContent).toContain('Default Subtitle');
    expect(caption?.textContent).toContain('Default Caption');
    expect(closeButton).toBeTruthy();
  });

  it('should render a notification when type is notification', async () => {
    fixture.componentRef.setInput('type', 'notification');
    fixture.detectChanges();
    await fixture.whenStable();

    const notificationElement =
      fixture.nativeElement.querySelector('cds-notification');
    expect(notificationElement).toBeTruthy();

    // Inline notifications typically use .cds--inline-notification__title / __subtitle
    const title = notificationElement?.querySelector(
      '.cds--inline-notification__title',
    );
    const subtitle = notificationElement?.querySelector(
      '.cds--inline-notification__subtitle',
    );
    const closeButton = notificationElement?.querySelector(
      '.cds--inline-notification__close-button',
    );

    expect(title).not.toBeNull();
    expect(title!.textContent).toContain('Default Title');

    expect(subtitle).not.toBeNull();
    // Don’t look for an extra <span> — text is often placed directly in .cds--inline-notification__subtitle
    expect(subtitle!.textContent).toContain('Default Subtitle');

    expect(closeButton).toBeTruthy();
  });

  it('should render an actionable notification when type is actionable-notification', async () => {
    fixture.componentRef.setInput('type', 'actionable-notification');
    fixture.detectChanges();
    await fixture.whenStable();

    const actionableNotificationElement = fixture.nativeElement.querySelector(
      'cds-actionable-notification',
    );
    expect(actionableNotificationElement).toBeTruthy();

    // Carbon’s actionable notifications often mirror inline classes
    // Check your actual markup to confirm the exact class name
    const title = actionableNotificationElement?.querySelector(
      '.cds--actionable-notification__title, .cds--inline-notification__title',
    );
    const subtitle = actionableNotificationElement?.querySelector(
      '.cds--actionable-notification__subtitle, .cds--inline-notification__subtitle',
    );
    const closeButton = actionableNotificationElement?.querySelector(
      '.cds--actionable-notification__close-button, .cds--inline-notification__close-button',
    );

    expect(title).not.toBeNull();
    expect(title!.textContent).toContain('Default Title');

    expect(subtitle).not.toBeNull();
    // Remove the .span lookup — it’s usually just text inside the .__subtitle element
    expect(subtitle!.textContent).toContain('Default Subtitle');

    expect(closeButton).toBeTruthy();
  });

  it('should hide close button when showClose is false', async () => {
    fixture.componentRef.setInput('showClose', false);
    fixture.componentRef.setInput('type', 'toast');
    fixture.detectChanges();
    await fixture.whenStable();

    const toastElement = fixture.nativeElement.querySelector('cds-toast');
    expect(toastElement).toBeTruthy();

    const closeButton = toastElement?.querySelector(
      '.cds--toast-notification__close-button',
    );
    expect(closeButton).toBeFalsy();
  });

  it('should change notification type dynamically', async () => {
    fixture.componentRef.setInput('notificationType', 'error');
    fixture.componentRef.setInput('type', 'toast');
    fixture.detectChanges();
    await fixture.whenStable();

    const toastElement = fixture.nativeElement.querySelector('cds-toast');
    expect(toastElement).toBeTruthy();
    expect(toastElement?.classList).toContain('cds--toast-notification--error');
  });

  it('should not render any notification if type is invalid', async () => {
    fixture.componentRef.setInput('type', 'invalid-type' as any);
    fixture.detectChanges();
    await fixture.whenStable();

    const toastElement = fixture.nativeElement.querySelector('cds-toast');
    const notificationElement =
      fixture.nativeElement.querySelector('cds-notification');
    const actionableNotificationElement = fixture.nativeElement.querySelector(
      'cds-actionable-notification',
    );

    expect(toastElement).toBeFalsy();
    expect(notificationElement).toBeFalsy();
    expect(actionableNotificationElement).toBeFalsy();
  });
});
