import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmCustomersComponent } from './qm-customers.component';

describe('QmCustomersComponent', () => {
  let component: QmCustomersComponent;
  let fixture: ComponentFixture<QmCustomersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
