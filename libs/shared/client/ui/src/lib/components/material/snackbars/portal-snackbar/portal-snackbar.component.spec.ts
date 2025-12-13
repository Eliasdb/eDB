import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSnackbarComponent } from './portal-snackbar.component';

describe('UserPortalSnackbarComponent', () => {
  let component: PortalSnackbarComponent;
  let fixture: ComponentFixture<PortalSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalSnackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
