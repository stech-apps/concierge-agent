import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmArriveAppointmentComponent } from './qm-arrive-appointment.component';

describe('QmArriveAppointmentComponent', () => {
  let component: QmArriveAppointmentComponent;
  let fixture: ComponentFixture<QmArriveAppointmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmArriveAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmArriveAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
