import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmLoadingModalComponent } from './qm-loading-modal.component';

describe('QmLoadingModalComponent', () => {
  let component: QmLoadingModalComponent;
  let fixture: ComponentFixture<QmLoadingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmLoadingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmLoadingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
