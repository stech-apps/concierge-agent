import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmPageHeaderComponent } from './qm-page-header.component';

describe('QmPageHeaderComponent', () => {
  let component: QmPageHeaderComponent;
  let fixture: ComponentFixture<QmPageHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
