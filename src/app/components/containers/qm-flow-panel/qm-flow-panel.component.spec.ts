import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmFlowPanelComponent } from './qm-flow-panel.component';

describe('QmFlowPanelComponent', () => {
  let component: QmFlowPanelComponent;
  let fixture: ComponentFixture<QmFlowPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmFlowPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmFlowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
