import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmQuickArriveComponent } from './qm-quick-arrive.component';

describe('QmQucikCreateComponent', () => {
  let component: QmQuickArriveComponent;
  let fixture: ComponentFixture<QmQuickArriveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmQuickArriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmQuickArriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
