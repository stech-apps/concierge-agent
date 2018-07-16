import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmQuickServeComponent } from './qm-quick-serve.component';

describe('QmQucikServeComponent', () => {
  let component: QmQuickServeComponent;
  let fixture: ComponentFixture<QmQuickServeComponent>;

  beforeEach(async(() => {
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
