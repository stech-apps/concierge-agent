import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmNotesModalComponent } from './qm-notes-modal.component';

describe('QmNotesModalComponent', () => {
  let component: QmNotesModalComponent;
  let fixture: ComponentFixture<QmNotesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmNotesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
