import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortBarComponent } from './books-sort-bar.component';

describe('SortBarComponent', () => {
  let component: SortBarComponent;
  let fixture: ComponentFixture<SortBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortBarComponent]
    });
    fixture = TestBed.createComponent(SortBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
