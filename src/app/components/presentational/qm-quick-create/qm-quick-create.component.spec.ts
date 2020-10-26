import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmQuickCreateComponent } from './qm-quick-create.component';

describe('QmQucikCreateComponent', () => {
  let component: QmQuickCreateComponent;
  let fixture: ComponentFixture<QmQuickCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmQuickCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmQuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
