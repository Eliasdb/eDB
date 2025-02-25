import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCollectionOverviewComponent } from './customers-collection-overview.component';

describe('CollectionOverviewComponent', () => {
  let component: CollectionOverviewComponent;
  let fixture: ComponentFixture<CollectionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersCollectionOverviewComponent]
    });
    fixture = TestBed.createComponent(CustomersCollectionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
