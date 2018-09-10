import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmTransferToServicePoolComponent } from './qm-transfer-to-service-pool.component';

describe('QmTransferToServicePoolComponent', () => {
  let component: QmTransferToServicePoolComponent;
  let fixture: ComponentFixture<QmTransferToServicePoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTransferToServicePoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTransferToServicePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
