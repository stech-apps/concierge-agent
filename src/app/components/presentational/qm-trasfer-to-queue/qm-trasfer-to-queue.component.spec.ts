import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmTrasferToQueueComponent } from './qm-trasfer-to-queue.component';

describe('QmTrasferToQueueComponent', () => {
  let component: QmTrasferToQueueComponent;
  let fixture: ComponentFixture<QmTrasferToQueueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTrasferToQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTrasferToQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
