import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmFlowComponent } from './qm-flow.component';

describe('QmFlowComponent', () => {
  let component: QmFlowComponent;
  let fixture: ComponentFixture<QmFlowComponent>;

  beforeEach(async(() => {
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
