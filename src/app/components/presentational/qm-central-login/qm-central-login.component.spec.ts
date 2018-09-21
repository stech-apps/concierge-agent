import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmCentralLoginComponent } from './qm-central-login.component';

describe('QmProfileComponent', () => {
  let component: QmCentralLoginComponent;
  let fixture: ComponentFixture<QmCentralLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmCentralLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmCentralLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
