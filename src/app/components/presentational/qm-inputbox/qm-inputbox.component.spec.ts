import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmInputboxComponent } from './qm-inputbox.component';

describe('QmInputboxComponent', () => {
  let component: QmInputboxComponent;
  let fixture: ComponentFixture<QmInputboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmInputboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmInputboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
