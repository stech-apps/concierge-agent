import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmSideMenuComponent } from './qm-side-menu.component';

describe('QmSideMenuComponent', () => {
  let component: QmSideMenuComponent;
  let fixture: ComponentFixture<QmSideMenuComponent>;

  beforeEach(async(() => {
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
