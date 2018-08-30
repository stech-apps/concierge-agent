import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmEditAppointmentComponent } from './qm-edit-appointment.component';

describe('QmEditAppointmentComponent', () => {
  let component: QmEditAppointmentComponent;
  let fixture: ComponentFixture<QmEditAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmEditAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmEditAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
