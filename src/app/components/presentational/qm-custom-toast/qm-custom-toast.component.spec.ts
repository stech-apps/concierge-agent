import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmCustomToastComponent } from './qm-custom-toast.component';

describe('QmCustomToastComponent', () => {
  let component: QmCustomToastComponent;
  let fixture: ComponentFixture<QmCustomToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCustomToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCustomToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
