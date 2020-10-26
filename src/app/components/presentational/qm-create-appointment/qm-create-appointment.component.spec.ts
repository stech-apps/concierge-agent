import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCreateAppointmentComponent } from './qm-create-appointment.component';

describe('QmCreateAppointmentComponent', () => {
  let component: QmCreateAppointmentComponent;
  let fixture: ComponentFixture<QmCreateAppointmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCreateAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCreateAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
