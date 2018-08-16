import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmArriveAppointmentComponent } from './qm-arrive-appointment.component';

describe('QmArriveAppointmentComponent', () => {
  let component: QmArriveAppointmentComponent;
  let fixture: ComponentFixture<QmArriveAppointmentComponent>;

  beforeEach(async(() => {
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
