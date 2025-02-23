import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyAddedSnackbarComponent } from './already-added-snackbar.component';

describe('AlreadyAddedSnackbarComponent', () => {
  let component: AlreadyAddedSnackbarComponent;
  let fixture: ComponentFixture<AlreadyAddedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadyAddedSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlreadyAddedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
