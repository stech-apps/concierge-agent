import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmIdentifyAppointmentComponent } from './qm-identify-appointment.component';

describe('QmIdentifyAppointmentComponent', () => {
  let component: QmIdentifyAppointmentComponent;
  let fixture: ComponentFixture<QmIdentifyAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmIdentifyAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmIdentifyAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
