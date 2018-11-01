import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmDoneModalComponent } from './qm-done-modal.component';

describe('QmDoneModalComponent', () => {
  let component: QmDoneModalComponent;
  let fixture: ComponentFixture<QmDoneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmDoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmDoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
