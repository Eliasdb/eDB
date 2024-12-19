import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchModule } from 'carbon-components-angular';
import { UiSearchComponent } from './search.component';

describe('UiSearchComponent', () => {
  let component: UiSearchComponent;
  let fixture: ComponentFixture<UiSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModule, UiSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct default inputs', () => {
    expect(component.theme).toBe('dark');
    expect(component.placeholder).toBe('Search');
    expect(component.autocomplete).toBe('off');
    expect(component.disabled).toBeFalsy();
    expect(component.size).toBe('md');
    expect(component.skeleton).toBeFalsy();
    expect(component.expandable).toBeFalsy();
  });

  it('should bind input properties to the cds-search component', () => {
    component.theme = 'light';
    component.placeholder = 'Type something';
    component.autocomplete = 'on';
    component.disabled = true;
    component.size = 'lg';
    component.skeleton = true;
    component.expandable = true;

    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('cds-search'),
    ).nativeElement;

    expect(searchElement.getAttribute('ng-reflect-theme')).toBe('light');
    expect(searchElement.getAttribute('ng-reflect-placeholder')).toBe(
      'Type something',
    );
    expect(searchElement.getAttribute('ng-reflect-autocomplete')).toBe('on');
    expect(searchElement.getAttribute('ng-reflect-disabled')).toBe('true');
    expect(searchElement.getAttribute('ng-reflect-size')).toBe('lg');
    expect(searchElement.getAttribute('ng-reflect-skeleton')).toBe('true');
    expect(searchElement.getAttribute('ng-reflect-expandable')).toBe('true');
  });

  it('should emit valueChange event when input value changes', () => {
    const valueChangeSpy = vi.spyOn(component.valueChange, 'emit');
    const searchElement = fixture.debugElement.query(By.css('cds-search'));

    searchElement.triggerEventHandler('valueChange', 'test value');
    expect(valueChangeSpy).toHaveBeenCalledWith('test value');
  });

  it('should emit clear event when the search is cleared', () => {
    const clearSpy = vi.spyOn(component.clear, 'emit');
    const searchElement = fixture.debugElement.query(By.css('cds-search'));

    searchElement.triggerEventHandler('clear', {});
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should disable the search input when the disabled property is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('cds-search'),
    ).nativeElement;
    expect(searchElement.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set the correct placeholder', () => {
    component.placeholder = 'Custom placeholder';
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('cds-search'),
    ).nativeElement;
    expect(searchElement.getAttribute('ng-reflect-placeholder')).toBe(
      'Custom placeholder',
    );
  });

  it('should have the correct size', () => {
    component.size = 'sm';
    fixture.detectChanges();

    const searchElement = fixture.debugElement.query(
      By.css('cds-search'),
    ).nativeElement;
    expect(searchElement.getAttribute('ng-reflect-size')).toBe('sm');
  });
});
