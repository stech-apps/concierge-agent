import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmTimeFilterComponent } from './qm-time-filter.component';

describe('QmTimeFilterComponent', () => {
  let component: QmTimeFilterComponent;
  let fixture: ComponentFixture<QmTimeFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTimeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
