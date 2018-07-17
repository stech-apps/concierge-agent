import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmHomeMenuComponent } from './qm-home-menu.component';

describe('QmHomeMenuComponent', () => {
  let component: QmHomeMenuComponent;
  let fixture: ComponentFixture<QmHomeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmHomeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmHomeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
