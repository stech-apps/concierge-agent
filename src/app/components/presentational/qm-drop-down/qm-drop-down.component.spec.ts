import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmDropDownComponent } from './qm-drop-down.component';

describe('QmDropDownComponent', () => {
  let component: QmDropDownComponent;
  let fixture: ComponentFixture<QmDropDownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
