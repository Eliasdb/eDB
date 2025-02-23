import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCollectionGridOverviewComponent } from './books-collection-grid-overview.component';

describe('BooksCollectionGridOverviewComponent', () => {
  let component: BooksCollectionGridOverviewComponent;
  let fixture: ComponentFixture<BooksCollectionGridOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksCollectionGridOverviewComponent]
    });
    fixture = TestBed.createComponent(BooksCollectionGridOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
