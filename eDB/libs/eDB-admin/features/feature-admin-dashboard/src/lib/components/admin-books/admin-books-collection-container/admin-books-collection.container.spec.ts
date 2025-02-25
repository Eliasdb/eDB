import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBooksCollectionContainerComponent } from './admin-books-collection-container.component';

describe('AdminBooksCollectionContainerComponent', () => {
  let component: AdminBooksCollectionContainerComponent;
  let fixture: ComponentFixture<AdminBooksCollectionContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBooksCollectionContainerComponent]
    });
    fixture = TestBed.createComponent(AdminBooksCollectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
