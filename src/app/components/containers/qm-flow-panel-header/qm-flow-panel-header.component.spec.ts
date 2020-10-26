import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmFlowPanelHeaderComponent } from './qm-flow-panel-header.component';

describe('QmFlowPanelHeaderComponent', () => {
  let component: QmFlowPanelHeaderComponent;
  let fixture: ComponentFixture<QmFlowPanelHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmFlowPanelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmFlowPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
