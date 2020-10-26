import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmTransferToStaffPoolComponent } from './qm-transfer-to-staff-pool.component';

describe('QmTransferToStaffPoolComponent', () => {
  let component: QmTransferToStaffPoolComponent;
  let fixture: ComponentFixture<QmTransferToStaffPoolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTransferToStaffPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTransferToStaffPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
