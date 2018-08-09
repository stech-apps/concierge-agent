import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmCheckoutViewComponent } from './qm-checkout-view.component';

describe('QmCheckoutViewComponent', () => {
  let component: QmCheckoutViewComponent;
  let fixture: ComponentFixture<QmCheckoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCheckoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCheckoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
