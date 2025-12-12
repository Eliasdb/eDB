import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureIzmirComponent } from './feature-izmir';

describe('FeatureIzmirComponent', () => {
  let component: FeatureIzmirComponent;
  let fixture: ComponentFixture<FeatureIzmirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureIzmirComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureIzmirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
