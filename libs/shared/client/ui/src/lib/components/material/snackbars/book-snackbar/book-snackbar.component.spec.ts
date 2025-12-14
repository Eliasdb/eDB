import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookSnackbarComponent } from './book-snackbar.component';

describe('BookSnackbarComponent', () => {
  let component: BookSnackbarComponent;
  let fixture: ComponentFixture<BookSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSnackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
