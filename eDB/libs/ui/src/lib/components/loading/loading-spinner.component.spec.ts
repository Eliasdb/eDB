import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingModule } from 'carbon-components-angular';
import { UiLoadingSpinnerComponent } from './loading-spinner.component';

describe('UiLoadingSpinnerComponent', () => {
  let component: UiLoadingSpinnerComponent;
  let fixture: ComponentFixture<UiLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingModule, UiLoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the loading spinner when active', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.attributes['ng-reflect-size']).toBe('sm'); // Default size
    expect(loadingElement.attributes['ng-reflect-overlay']).toBe('false'); // Default overlay
  });

  it('should not render the loading spinner when inactive', () => {
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement).toBeNull();
  });

  it('should apply the correct size', () => {
    fixture.componentRef.setInput('size', 'normal');
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement.attributes['ng-reflect-size']).toBe('normal');
  });

  it('should apply the overlay attribute', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement.attributes['ng-reflect-overlay']).toBe('true');
  });

  it('should update isActive dynamically', () => {
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    let loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement).toBeNull();

    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    loadingElement = fixture.debugElement.query(By.css('cds-loading'));
    expect(loadingElement).toBeTruthy();
  });
});
