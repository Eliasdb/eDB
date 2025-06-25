import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonModule } from 'carbon-components-angular';
import { UiSkeletonTextComponent } from './skeleton-text.component';

describe('UiSkeletonTextComponent', () => {
  let fixture: ComponentFixture<UiSkeletonTextComponent>;
  let component: UiSkeletonTextComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonModule, UiSkeletonTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSkeletonTextComponent);
    component = fixture.componentInstance;
  });

  it('should render with default inputs', () => {
    fixture.detectChanges();
    const skeletonTextElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-skeleton-text');

    expect(skeletonTextElement).toBeTruthy();
    expect(skeletonTextElement.getAttribute('ng-reflect-lines')).toBe('3'); // Default lines
    expect(skeletonTextElement.getAttribute('ng-reflect-min-line-width')).toBe(
      '50',
    ); // Default minLineWidth
    expect(skeletonTextElement.getAttribute('ng-reflect-max-line-width')).toBe(
      '100',
    ); // Default maxLineWidth
  });

  it('should update lines dynamically', () => {
    fixture.componentRef.setInput('lines', 5);
    fixture.detectChanges();

    const skeletonTextElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-skeleton-text');

    expect(skeletonTextElement.getAttribute('ng-reflect-lines')).toBe('5');
  });

  it('should update minLineWidth dynamically', () => {
    fixture.componentRef.setInput('minLineWidth', 30);
    fixture.detectChanges();

    const skeletonTextElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-skeleton-text');

    expect(skeletonTextElement.getAttribute('ng-reflect-min-line-width')).toBe(
      '30',
    );
  });

  it('should update maxLineWidth dynamically', () => {
    fixture.componentRef.setInput('maxLineWidth', 80);
    fixture.detectChanges();

    const skeletonTextElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-skeleton-text');

    expect(skeletonTextElement.getAttribute('ng-reflect-max-line-width')).toBe(
      '80',
    );
  });

  it('should render with all inputs set dynamically', () => {
    fixture.componentRef.setInput('lines', 4);
    fixture.componentRef.setInput('minLineWidth', 60);
    fixture.componentRef.setInput('maxLineWidth', 90);
    fixture.detectChanges();

    const skeletonTextElement: HTMLElement =
      fixture.nativeElement.querySelector('cds-skeleton-text');

    expect(skeletonTextElement.getAttribute('ng-reflect-lines')).toBe('4');
    expect(skeletonTextElement.getAttribute('ng-reflect-min-line-width')).toBe(
      '60',
    );
    expect(skeletonTextElement.getAttribute('ng-reflect-max-line-width')).toBe(
      '90',
    );
  });
});
