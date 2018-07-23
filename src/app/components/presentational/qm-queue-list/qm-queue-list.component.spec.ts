import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmQueueListComponent } from './qm-queue-list.component';

describe('QmQueueListComponent', () => {
  let component: QmQueueListComponent;
  let fixture: ComponentFixture<QmQueueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmQueueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmQueueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
