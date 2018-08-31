import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmRescheduleComponent } from './qm-reschedule.component';

describe('QmRescheduleComponent', () => {
  let component: QmRescheduleComponent;
  let fixture: ComponentFixture<QmRescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmRescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
