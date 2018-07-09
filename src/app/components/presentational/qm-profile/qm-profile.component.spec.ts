import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmProfileComponent } from './qm-profile.component';

describe('QmProfileComponent', () => {
  let component: QmProfileComponent;
  let fixture: ComponentFixture<QmProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
