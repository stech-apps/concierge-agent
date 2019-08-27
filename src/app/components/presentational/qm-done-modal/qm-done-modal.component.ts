import { Observable, Subject, Subscription } from 'rxjs';
import { UserSelectors } from 'src/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoCloseStatusDispatchers, AutoCloseStatusSelectors } from 'src/store/services/autoclose-status';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

@Component({
  selector: 'qm-done-modal',
  templateUrl: './qm-done-modal.component.html',
  styleUrls: ['./qm-done-modal.component.scss']
})
export class QmDoneModalComponent implements OnInit, OnDestroy {

  heading: string = '';
  subHeading: string = '';
  fieldList: Array<{icon: string, label: string}> = [];
  fieldListHeading: string = '';
  visitID:string;

  userDirection$: Observable<string>;
  userDirection: string;
  subscriptions: Subscription  = new Subscription();
  isAutoCloseModal: boolean;
  autoCloseTimer = null;
  skipBranchFocus: boolean;
  skipButtonHover: boolean;
  mousePressed: boolean;

  constructor(public activeModal: NgbActiveModal,
    private userSelectors: UserSelectors, private modalStatusDispatchers: AutoCloseStatusDispatchers,
    private modalStatusSelectors: AutoCloseStatusSelectors, private localStorage: LocalStorage) { }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    const userSubscription = this.userDirection$.subscribe((ud) => {
      this.userDirection = ud;
    });

    this.subscriptions.add(userSubscription);
    this.isAutoCloseModal = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.MODAL_AUTOCLOSE);
    this.modalStatusDispatchers.setModalStatus(this.isAutoCloseModal);
    const modalStatusSubscription = this.modalStatusSelectors.ModalStatus$.subscribe( ms => {
      this.isAutoCloseModal = ms;
      this.setAutoclose();
    });
    this.subscriptions.add(modalStatusSubscription);
    setTimeout(() => {
      if (document.getElementById('qm-modal__headline')) {
        document.getElementById('qm-modal__headline').focus();
      }
    }, 100);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  test() {
  }

  onSwitchChange() {
    this.modalStatusDispatchers.setModalStatus(this.isAutoCloseModal);
    this.localStorage.setSettings(STORAGE_SUB_KEY.MODAL_AUTOCLOSE, this.isAutoCloseModal);
  }

  setAutoclose() {
    if (this.isAutoCloseModal) {
      this.autoCloseTimer = setTimeout(() => {
        this.activeModal.close(false);
      }, 5000);
    } else {
      clearTimeout(this.autoCloseTimer);
    }
  }
}
