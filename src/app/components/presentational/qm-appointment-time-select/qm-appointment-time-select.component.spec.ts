import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmAppointmentTimeSelectComponent } from './qm-appointment-time-select.component';

describe('QmAppointmentTimeSelectComponent', () => {
  let component: QmAppointmentTimeSelectComponent;
  let fixture: ComponentFixture<QmAppointmentTimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmAppointmentTimeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmAppointmentTimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
