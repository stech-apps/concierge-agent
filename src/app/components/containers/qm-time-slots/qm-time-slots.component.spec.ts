import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmTimeSlotsComponent } from './qm-time-slots.component';

describe('QmTimeSlotsComponent', () => {
  let component: QmTimeSlotsComponent;
  let fixture: ComponentFixture<QmTimeSlotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTimeSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTimeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
