import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCollectionListOverviewComponent } from './books-collection-list-overview.component';

describe('BooksCollectionListOverviewComponent', () => {
  let component: BooksCollectionListOverviewComponent;
  let fixture: ComponentFixture<BooksCollectionListOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksCollectionListOverviewComponent]
    });
    fixture = TestBed.createComponent(BooksCollectionListOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
