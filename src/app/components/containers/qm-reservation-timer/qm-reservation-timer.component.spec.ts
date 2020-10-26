import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmReservationTimerComponent } from './qm-reservation-timer.component';

describe('QmReservationTimerComponent', () => {
  let component: QmReservationTimerComponent;
  let fixture: ComponentFixture<QmReservationTimerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmReservationTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmReservationTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
