import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmHomeComponent } from './qm-home.component';

describe('QmHomeComponent', () => {
  let component: QmHomeComponent;
  let fixture: ComponentFixture<QmHomeComponent>;

  beforeEach(async(() => {
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
