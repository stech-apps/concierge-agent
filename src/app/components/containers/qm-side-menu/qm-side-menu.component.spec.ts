import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmSideMenuComponent } from './qm-side-menu.component';

describe('QmSideMenuComponent', () => {
  let component: QmSideMenuComponent;
  let fixture: ComponentFixture<QmSideMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
