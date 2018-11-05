import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmTimeFilterComponent } from './qm-time-filter.component';

describe('QmTimeFilterComponent', () => {
  let component: QmTimeFilterComponent;
  let fixture: ComponentFixture<QmTimeFilterComponent>;

  beforeEach(async(() => {
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
