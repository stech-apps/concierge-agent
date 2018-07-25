import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmModalComponent } from './qm-modal.component';

describe('QmModalComponent', () => {
  let component: QmModalComponent;
  let fixture: ComponentFixture<QmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
