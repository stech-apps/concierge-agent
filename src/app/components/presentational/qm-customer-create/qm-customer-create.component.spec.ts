import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCustomerCreateComponent } from './qm-customer-create.component';

describe('QmCustomerCreateComponent', () => {
  let component: QmCustomerCreateComponent;
  let fixture: ComponentFixture<QmCustomerCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCustomerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCustomerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
