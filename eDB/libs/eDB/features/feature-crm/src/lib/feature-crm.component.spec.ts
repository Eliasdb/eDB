import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CRMContainer } from './feature-crm.component';

describe('FeatureCrmComponent', () => {
  let component: CRMContainer;
  let fixture: ComponentFixture<CRMContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRMContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(CRMContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
