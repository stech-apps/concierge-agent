import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmFlowPanelHeaderComponent } from './qm-flow-panel-header.component';

describe('QmFlowPanelHeaderComponent', () => {
  let component: QmFlowPanelHeaderComponent;
  let fixture: ComponentFixture<QmFlowPanelHeaderComponent>;

  beforeEach(async(() => {
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
