import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmLoaderComponent } from './qm-loader.component';

describe('QmLoaderComponent', () => {
  let component: QmLoaderComponent;
  let fixture: ComponentFixture<QmLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
