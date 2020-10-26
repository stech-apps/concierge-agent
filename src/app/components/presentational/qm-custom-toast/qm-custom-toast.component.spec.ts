import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCustomToastComponent } from './qm-custom-toast.component';

describe('QmCustomToastComponent', () => {
  let component: QmCustomToastComponent;
  let fixture: ComponentFixture<QmCustomToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCustomToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCustomToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
