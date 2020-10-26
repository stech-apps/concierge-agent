import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmClearInputButtonComponent } from './qm-clear-input-button.component';

describe('QmClearInputButtonComponent', () => {
  let component: QmClearInputButtonComponent;
  let fixture: ComponentFixture<QmClearInputButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmClearInputButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmClearInputButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
