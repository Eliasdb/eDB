import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPortalSnackbarComponent } from './user-portal-snackbar.component';

describe('UserPortalSnackbarComponent', () => {
  let component: UserPortalSnackbarComponent;
  let fixture: ComponentFixture<UserPortalSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPortalSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPortalSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
