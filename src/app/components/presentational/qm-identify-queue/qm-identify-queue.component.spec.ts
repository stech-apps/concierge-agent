import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmIdentifyQueueComponent } from './qm-identify-queue.component';

describe('QmIdentifyQueueComponent', () => {
  let component: QmIdentifyQueueComponent;
  let fixture: ComponentFixture<QmIdentifyQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmIdentifyQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmIdentifyQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
