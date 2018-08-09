import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmIdentifyCustomerComponent } from './qm-identify-customer.component';

describe('QmIdentifyCustomerComponent', () => {
  let component: QmIdentifyCustomerComponent;
  let fixture: ComponentFixture<QmIdentifyCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmIdentifyCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmIdentifyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
