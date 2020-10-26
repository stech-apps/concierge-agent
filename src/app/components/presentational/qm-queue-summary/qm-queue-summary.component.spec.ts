import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmQueueSummaryComponent } from './qm-queue-summary.component';

describe('QmQueueSummaryComponent', () => {
  let component: QmQueueSummaryComponent;
  let fixture: ComponentFixture<QmQueueSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmQueueSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmQueueSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
