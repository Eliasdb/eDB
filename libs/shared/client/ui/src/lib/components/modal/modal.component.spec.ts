import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalModule } from 'carbon-components-angular';
import { vi } from 'vitest';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTextAreaComponent } from '../inputs/text-area/text-area.component';
import { UiTextInputComponent } from '../inputs/text-input/input.component';
import { UiModalComponent } from './modal.component';

describe('UiModalComponent', () => {
  let component: UiModalComponent;
  let fixture: ComponentFixture<UiModalComponent>;
  let routerMock: Router;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() } as unknown as Router;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ModalModule,
        ReactiveFormsModule,
        UiButtonComponent,
        UiTextInputComponent,
        UiTextAreaComponent,
        UiModalComponent,
      ],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UiModalComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('header', 'Default Header');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the header correctly', () => {
    fixture.componentRef.setInput('header', 'Test Header');
    fixture.detectChanges();
    const headerElement = fixture.nativeElement.querySelector(
      'h3[cdsModalHeaderHeading]',
    );
    expect(headerElement.textContent.trim()).toBe('Test Header');
  });

  it('should render content when provided', () => {
    fixture.componentRef.setInput('content', 'Test Content');
    fixture.detectChanges();
    const contentElement = fixture.nativeElement.querySelector(
      '.confirmation-text p',
    );
    expect(contentElement.textContent.trim()).toBe('Test Content');
  });

  it('should emit save event with form data on save', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    fixture.detectChanges();

    component.onSave();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should emit save event without form data on save when no form is present', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    fixture.componentRef.setInput('header', 'Default Header');
    fixture.detectChanges();

    component.onSave();
    expect(saveSpy).toHaveBeenCalledWith();
  });

  it('should emit dismissed event on cancel', () => {
    const closeSpy = vi.spyOn(component.dismissed, 'emit');
    fixture.componentRef.setInput('header', 'Default Header');
    fixture.detectChanges();
    component.onCancel();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should navigate to cancelRoute on cancel if cancelRoute is set', () => {
    fixture.componentRef.setInput('cancelRoute', '/cancel');
    fixture.componentRef.setInput('header', 'Default Header');
    fixture.detectChanges();

    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/cancel']);
  });

  it('should render custom content if provided', () => {
    fixture.componentRef.setInput('content', 'Test content');
    fixture.detectChanges();

    const customContentElement = fixture.nativeElement.querySelector('p');
    expect(customContentElement).toBeTruthy(); // Ensure the element exists
    expect(customContentElement.textContent.trim()).toBe('Test content');
  });
});
