import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookModalComponent } from './add-book-modal.component';

describe('AddBookModalComponent', () => {
  let component: AddBookModalComponent;
  let fixture: ComponentFixture<AddBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookModalComponent]
    });
    fixture = TestBed.createComponent(AddBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
