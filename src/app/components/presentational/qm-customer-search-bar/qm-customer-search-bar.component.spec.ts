import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCustomerSearchBarComponent } from './qm-customer-search-bar.component';

describe('QmCustomerSearchBarComponent', () => {
  let component: QmCustomerSearchBarComponent;
  let fixture: ComponentFixture<QmCustomerSearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCustomerSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCustomerSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
