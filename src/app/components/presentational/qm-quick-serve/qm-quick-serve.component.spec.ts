import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmQuickServeComponent } from './qm-quick-serve.component';

describe('QmQucikServeComponent', () => {
  let component: QmQuickServeComponent;
  let fixture: ComponentFixture<QmQuickServeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmQuickServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmQuickServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
