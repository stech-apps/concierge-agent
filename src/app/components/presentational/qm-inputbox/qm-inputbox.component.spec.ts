import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmInputboxComponent } from './qm-inputbox.component';

describe('QmInputboxComponent', () => {
  let component: QmInputboxComponent;
  let fixture: ComponentFixture<QmInputboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmInputboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmInputboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
