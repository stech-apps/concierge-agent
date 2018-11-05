import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmTimelistSidebarComponent } from './qm-timelist-sidebar.component';

describe('QmTimelistSidebarComponent', () => {
  let component: QmTimelistSidebarComponent;
  let fixture: ComponentFixture<QmTimelistSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmTimelistSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmTimelistSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
