import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmTimeFilterItemsComponent } from './qm-time-filter-items.component';

describe('QmTimeFilterItemsComponent', () => {
  let component: QmTimeFilterItemsComponent;
  let fixture: ComponentFixture<QmTimeFilterItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTimeFilterItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTimeFilterItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
