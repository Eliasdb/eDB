import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectModule } from 'carbon-components-angular';
import { UiSelectComponent } from './select.component';

describe('UiSelectComponent', () => {
  let component: UiSelectComponent;
  let fixture: ComponentFixture<UiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectModule, FormsModule, UiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind input properties correctly', () => {
    fixture.componentRef.setInput('label', 'Select Label');
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.componentRef.setInput('invalidText', 'Invalid text');
    fixture.componentRef.setInput('warnText', 'Warn text');
    fixture.componentRef.setInput('placeholder', 'Choose an option');
    fixture.componentRef.setInput('theme', 'dark');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('readonly', true);
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('warn', true);
    fixture.componentRef.setInput('skeleton', true);
    fixture.componentRef.setInput('display', 'inline');

    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('cds-select'));

    expect(selectElement.attributes['ng-reflect-label']).toBe('Select Label');
    expect(selectElement.attributes['ng-reflect-helper-text']).toBe(
      'Helper text',
    );
    expect(selectElement.attributes['ng-reflect-invalid-text']).toBe(
      'Invalid text',
    );
    expect(selectElement.attributes['ng-reflect-warn-text']).toBe('Warn text');
    expect(selectElement.attributes['ng-reflect-placeholder']).toBe(
      'Choose an option',
    );
    expect(selectElement.attributes['ng-reflect-theme']).toBe('dark');
    expect(selectElement.attributes['ng-reflect-size']).toBe('lg');
    expect(selectElement.attributes['ng-reflect-disabled']).toBe('true');
    expect(selectElement.attributes['ng-reflect-readonly']).toBe('true');
    expect(selectElement.attributes['ng-reflect-invalid']).toBe('true');
    expect(selectElement.attributes['ng-reflect-warn']).toBe('true');
    expect(selectElement.attributes['ng-reflect-skeleton']).toBe('true');
    expect(selectElement.attributes['ng-reflect-display']).toBe('inline');
  });

  it('should render options correctly', () => {
    fixture.componentRef.setInput('options', [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      {
        label: 'Group 1',
        group: true,
        options: [
          { value: '3', label: 'Sub Option 1' },
          { value: '4', label: 'Sub Option 2' },
        ],
      },
    ]);

    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(4);

    expect(options[0].nativeElement.value).toBe('1');
    expect(options[0].nativeElement.textContent).toBe('Option 1');

    expect(options[1].nativeElement.value).toBe('2');
    expect(options[1].nativeElement.textContent).toBe('Option 2');

    const optgroup = fixture.debugElement.query(By.css('optgroup'));
    expect(optgroup).toBeTruthy();
    expect(optgroup.attributes['label']).toBe('Group 1');

    const subOptions = optgroup.queryAll(By.css('option'));
    expect(subOptions.length).toBe(2);
    expect(subOptions[0].nativeElement.value).toBe('3');
    expect(subOptions[0].nativeElement.textContent).toBe('Sub Option 1');
  });

  it('should render placeholder correctly', () => {
    fixture.componentRef.setInput('placeholder', 'Select an item');
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(
      By.css('option[disabled][hidden]'),
    );
    expect(placeholder.nativeElement.textContent.trim()).toBe('Select an item');
  });

  it('should update modelValue on option selection', () => {
    fixture.componentRef.setInput('options', [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]);

    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(
      By.css('cds-select'),
    ).nativeElement;
    selectElement.value = '2';
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    expect(component.modelValue).toBe('2');
  });

  it('should emit onModelChange when value changes', () => {
    const onModelChangeSpy = vi.spyOn(component, 'onModelChange');
    fixture.componentRef.setInput('options', [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]);

    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(
      By.css('select'),
    ).nativeElement;
    selectElement.value = '1';
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    expect(onModelChangeSpy).toHaveBeenCalledWith('1');
  });

  it('should sync localModel with model input', () => {
    fixture.componentRef.setInput('model', '2');
    fixture.detectChanges();

    expect(component.localModel()).toBe('2');
  });

  it('should update localModel when input model changes', () => {
    fixture.componentRef.setInput('model', '3');
    fixture.detectChanges();

    expect(component.localModel()).toBe('3');
  });
});
