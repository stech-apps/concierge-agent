import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCheckoutViewConfirmModalComponent } from './qm-checkout-view-confirm-modal.component';

describe('QmCheckoutViewConfirmModalComponent', () => {
  let component: QmCheckoutViewConfirmModalComponent;
  let fixture: ComponentFixture<QmCheckoutViewConfirmModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCheckoutViewConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCheckoutViewConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
