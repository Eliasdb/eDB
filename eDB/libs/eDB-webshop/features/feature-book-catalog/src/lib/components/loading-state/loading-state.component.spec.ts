import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStateComponent } from './loading-state.component';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingStateComponent]
    });
    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
