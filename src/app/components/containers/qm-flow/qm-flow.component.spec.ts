import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmFlowComponent } from './qm-flow.component';

describe('QmFlowComponent', () => {
  let component: QmFlowComponent;
  let fixture: ComponentFixture<QmFlowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
