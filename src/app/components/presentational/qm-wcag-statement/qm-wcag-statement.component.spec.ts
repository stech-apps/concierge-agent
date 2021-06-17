import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmWcagStatementComponent } from './qm-wcag-statement.component';

describe('QmWcagStatementComponent', () => {
  let component: QmWcagStatementComponent;
  let fixture: ComponentFixture<QmWcagStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmWcagStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmWcagStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
