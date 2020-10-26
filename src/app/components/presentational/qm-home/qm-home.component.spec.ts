import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmHomeComponent } from './qm-home.component';

describe('QmHomeComponent', () => {
  let component: QmHomeComponent;
  let fixture: ComponentFixture<QmHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
