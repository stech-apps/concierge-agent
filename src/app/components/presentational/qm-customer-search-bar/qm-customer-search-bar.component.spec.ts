import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmCustomerSearchBarComponent } from './qm-customer-search-bar.component';

describe('QmCustomerSearchBarComponent', () => {
  let component: QmCustomerSearchBarComponent;
  let fixture: ComponentFixture<QmCustomerSearchBarComponent>;

  beforeEach(async(() => {
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
