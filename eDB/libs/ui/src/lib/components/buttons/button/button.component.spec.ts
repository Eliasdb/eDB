import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './button.component';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
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
    expect(component.fullWidth()).toBe(true);
  });
});
