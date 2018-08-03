import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmTimeSlotsComponent } from './qm-time-slots.component';

describe('QmTimeSlotsComponent', () => {
  let component: QmTimeSlotsComponent;
  let fixture: ComponentFixture<QmTimeSlotsComponent>;

  beforeEach(async(() => {
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
