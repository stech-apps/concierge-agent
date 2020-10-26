import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmMessageBoxComponent } from './qm-message-box.component';

describe('QmMessageBoxComponent', () => {
  let component: QmMessageBoxComponent;
  let fixture: ComponentFixture<QmMessageBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
