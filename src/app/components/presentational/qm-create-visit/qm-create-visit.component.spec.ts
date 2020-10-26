import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCreateVisitComponent } from './qm-create-visit.component';

describe('QmCreateAppointmentComponent', () => {
  let component: QmCreateVisitComponent;
  let fixture: ComponentFixture<QmCreateVisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCreateVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCreateVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
