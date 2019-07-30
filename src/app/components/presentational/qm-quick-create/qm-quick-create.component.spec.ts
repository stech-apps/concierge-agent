import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmQuickCreateComponent } from './qm-quick-create.component';

describe('QmQucikCreateComponent', () => {
  let component: QmQuickCreateComponent;
  let fixture: ComponentFixture<QmQuickCreateComponent>;

  beforeEach(async(() => {
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
