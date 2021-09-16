import { UserSelectors } from 'src/store/services';
import { IService } from './../../../../models/IService';
import { Subscription, Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceSelectors, ServiceDispatchers, InfoMsgDispatchers, BranchSelectors,
   ServicePointSelectors, DataServiceError } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';
import { SPService } from 'src/util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/util/services/toast.service';
import { IServiceConfiguration } from '../../../../models/IServiceConfiguration';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { NOTIFICATION_TYPE } from 'src/util/services/rest/calendar.service';
import { QmCheckoutViewConfirmModalService } from '../qm-checkout-view-confirm-modal/qm-checkout-view-confirm-modal.service';
import { QueueService } from '../../../../util/services/queue.service';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';
import { ERROR_STATUS, Q_ERROR_CODE } from 'src/util/q-error';
import { QmModalService } from '../qm-modal/qm-modal.service';

@Component({
  selector: 'qm-quick-create',
  templateUrl: './qm-quick-create.component.html',
  styleUrls: ['./qm-quick-create.component.scss']
})
export class QmQuickCreateComponent implements OnInit, OnDestroy {

  @ViewChild('configServiceList') configServiceList: any;


  private subscriptions: Subscription = new Subscription();
  services: IService[] = new Array<IService>();
  selectedService: IService;
  private selectedBranch: IBranch;
  private selectedServicePoint: IServicePoint;
  userDirection$: Observable<string>;
  private isBottomBarVisible: boolean;
  private isTopBarVisible: boolean;
  searchText: String;
  filterText = '';
  inputChanged: Subject<string> = new Subject<string>();
  showToolTip: boolean;
  hoveredService = '';

  isQuickCreateEnable: boolean;
  isShowQueueView: boolean;
  editVisitEnable: boolean;
  focusQuickCreateItem: string;
  isTicketlessAvailable = false;
  isSMSAvailable = false;
  isTicketAvailable = false;
  themeColor = '#a9023a';

  constructor(
    private serviceSelectors: ServiceSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private branchSelectors: BranchSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private userSelectors: UserSelectors,
    private qmCheckoutViewConfirmModalService: QmCheckoutViewConfirmModalService,
    private queueService: QueueService,
    private infoMsgBoxDispatcher: InfoMsgDispatchers,
    private errorHandler: GlobalErrorHandler,
    private qmModalService: QmModalService,
  ) {
    this.showToolTip = false;
    this.userDirection$ = this.userSelectors.userDirection$;

    const servicePointSubscription = this.servicePointSelectors.openServicePoint$.subscribe((servicePoint) =>
    this.selectedServicePoint = servicePoint);
    this.subscriptions.add(servicePointSubscription);


    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      params => {
        if (params) {
          this.isShowQueueView = params.queueView;
          this.editVisitEnable = params.editVisit;
          this.isTicketAvailable = params.printerEnable;
          this.isSMSAvailable = params.sndSMS;
          this.isTicketlessAvailable = params.ticketLess;
          if (params.quickVisitAction) {
            if (params.quickVisitAction === 'create') {
              this.isQuickCreateEnable = true;
            } else {
              this.isQuickCreateEnable = false;
            }
          }
        }
      }
    );
    this.subscriptions.add(servicePointsSubscription);

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => this.selectedBranch = branch);
    this.subscriptions.add(branchSubscription);

    const serviceSubscription = this.serviceSelectors.getQuickCreateServices$.subscribe((services) => {
      if (services.length === 0) {
        this.serviceDispatchers.fetchServices(this.selectedBranch);
      } else {
        this.services = services;
        if (services.length > 0) {
          setTimeout(() => {
            this.checkShadow();
          }, 1000);
        }
      }
    });
    this.subscriptions.add(serviceSubscription);

    const selectedServiceSubscription = this.serviceSelectors.selectedServices$.subscribe((services) => {
      if (services.length > 0) {
        this.selectedService = services[0];
      } else {
        this.selectedService = null;
      }
    });
    this.subscriptions.add(selectedServiceSubscription);

    this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterServices(text));

  }

  ngOnInit() {
    this.selectedService = null;
    this.userDirection$ = this.userSelectors.userDirection$;
    this.isBottomBarVisible = true;
    this.isTopBarVisible = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  checkShadow() {
    this.onScroll(this.configServiceList.nativeElement);
  }
  
  ServiceSelectKeyPressed(selectedService: IService, $event) {
    if ($event.keyCode == 32 ) {
      $event.preventDefault();
      this.onServiceSelect(selectedService);
    }
  }
  
  onServiceSelect(selectedService: IService) {
    this.showToolTip = false;
    if (this.selectedService === selectedService) {
      this.selectedService = null;
      this.serviceDispatchers.setSelectedServices([]);
    } else {
      this.selectedService = selectedService;
      this.serviceDispatchers.setSelectedServices([selectedService]);
    }
  }

  onSelectButton(type: string) {
    let notificationType;
    if (type === 'sms') {
      notificationType = NOTIFICATION_TYPE.sms;
      const tempService = this.selectedService;
      this.qmCheckoutViewConfirmModalService.openForTransKeys('msg_send_confirmation',
          false,
          this.isSMSAvailable,
          this.themeColor, 'ok', 'label.cancel',
          (result: any) => {
            if (result) {
              if (result.phone) {
                this.createVisit(notificationType, result.phone, false, tempService);
              }
            }
          },
          () => { }, null);
    } else {
      notificationType = NOTIFICATION_TYPE.none;
      let isTicketSelect = false;
      if (type === 'ticket') {
        isTicketSelect = true;
      }
      this.createVisit(notificationType, undefined, isTicketSelect, this.selectedService);
    }
  }

  createVisit(notificationType: NOTIFICATION_TYPE, sms: string, isTicketSelect: boolean, service: IService) {
    this.spService.createVisit(this.selectedBranch, this.selectedServicePoint, [service],
      undefined, undefined, undefined, sms, isTicketSelect, undefined, notificationType).subscribe((result) => {
      this.showSuccessMessage(result, notificationType, isTicketSelect);
      this.queueService.fetechQueueInfo();
    }, error => {
      const err = new DataServiceError(error, null);
      if (err.errorCode === '0') {
        this.handleTimeoutError(err, 'visit_create_fail');
      } else {
        //this.loading = false;
        this.showErrorMessage(error);
      }
    });
  }

  showSuccessMessage(result: any, notificationType: NOTIFICATION_TYPE, isTicketSelect: boolean) {
    this.translateService.get(['visit_created',
        'label.visitcreated.subheading',
        'label.notifyoptions.smsandemail',
        'label.notifyoptions.sms', 'label.notifyoptions.email',
        'label.notifyoptions.ticket', 'label.createvisit.success.subheadingticketandsms']).subscribe(v => {

          this.selectedService = null;
          const searchBox = document.getElementById('visitSearch') as any;
          searchBox.value = '';
          this.filterText = '';

          let subheadingText = v['label.visitcreated.subheading'];
          if (isTicketSelect && notificationType === NOTIFICATION_TYPE.sms) {
            subheadingText = v['label.createvisit.success.subheadingticketandsms'];
          } else if (!isTicketSelect && notificationType === NOTIFICATION_TYPE.none) {
            subheadingText = '';
          } else if (isTicketSelect) {
            subheadingText = v['label.notifyoptions.ticket'];
          } else if (notificationType === NOTIFICATION_TYPE.sms) {
            subheadingText += ` ${v['label.notifyoptions.sms']}`;
          }

          this.qmModalService.openDoneModal(v['visit_created'],
            subheadingText, [], result.ticketId);
      });
  }

  handleTimeoutError(err: DataServiceError<any>, msg: string) {
    if (err.errorCode === '0') {
      this.translateService.get(msg).subscribe(v => {
        const unSuccessMessage = {
          firstLineName: v,
          icon: 'error'
        };
        this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(unSuccessMessage);
      });
      this.queueService.fetechQueueInfo();
    }
  }

  showErrorMessage(error: any) {
    const err = new DataServiceError(error, null);
    let errorKey = 'request_fail';

    if (error.status === ERROR_STATUS.INTERNAL_ERROR || error.status === ERROR_STATUS.CONFLICT) {
      errorKey = 'request_fail';
      if (err.errorCode === Q_ERROR_CODE.PRINTER_ERROR || err.errorCode === Q_ERROR_CODE.HUB_PRINTER_ERROR) {
        errorKey = 'printer_error';
      } else if (err.errorMsg.length > 0) {
        if (err.errorCode === Q_ERROR_CODE.QUEUE_FULL) {
          errorKey = 'queue_full';
        }
      }
    } else if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_JAM) {
      errorKey = 'paper_jam';
    } else if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_OUT) {
      errorKey = 'out_of_paper';
    } else {
      errorKey = 'visit_timeout';
    }

    if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_JAM || err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_OUT) {
      this.translateService.get('visit_create_fail').subscribe(v => {
        const successMessage = {
          firstLineName: v,
          icon: 'error'
        };
        this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
      });
    }
    this.errorHandler.showError(errorKey, err);
  }

  onScroll(eliment) {
    const scrollHeight = eliment.scrollHeight;
    const scrollTop = eliment.scrollTop;
    const viewHight = eliment.offsetHeight;

    if ((scrollTop + viewHight) > scrollHeight) {
      if (this.isBottomBarVisible) {
        this.isBottomBarVisible = false;
      }
    } else {
      if (!this.isBottomBarVisible) {
        this.isBottomBarVisible = true;
      }
    }

    if (scrollTop === 0) {
      if (this.isTopBarVisible) {
        this.isTopBarVisible = false;
      }
    } else {
      if (!this.isTopBarVisible) {
        this.isTopBarVisible = true;
      }
    }
  }

filterServices(newFilter: string) {
  this.filterText = newFilter;
 }

  clearSearchText() {
    this.filterText = "";
  }

  handleInput($event) {
    // this.queueSearched = true;
    this.inputChanged.next($event.target.value);
  }

  sortServiceList() {
    if (this.services) {
      // sort by name
      this.services = this.services.slice().sort((a, b) => {
          const stateA = a.internalName.toUpperCase(); // ignore upper and lowercase
          const stateB = b.internalName.toUpperCase(); // ignore upper and lowercase
          if (stateA < stateB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
    }
  }

  showHideToolTip() {
    this.showToolTip = !this.showToolTip;
  }

  handleCheckBoxClick() {}

  focusQmCheckbox(service) {
   this.focusQuickCreateItem = service.id;
  }

  focusOutQmCheckbox() {
    this.focusQuickCreateItem = null;
  }

  MouseEnteredCheckbox(service) {
    this.hoveredService = service.id;
  }
  MouseLeaveCheckbox() {
    this.hoveredService = '';
  }
  serviceId(internalName: string) {
    return internalName.replace(/\s/g, '');
  }

  KeyarrowLeft(value: string) {
    let nextElement;
    if (value === 'input') {
      if (this.isTicketlessAvailable) {
        nextElement = '_ticketless';
      } else if (this.isTicketAvailable) {
        nextElement = '_ticket';
      } else if (this.isSMSAvailable) {
        nextElement = '_sms';
      }
    } else if (value === 'ticketless') {
      if (this.isTicketAvailable) {
        nextElement = '_ticket';
      } else if (this.isSMSAvailable) {
        nextElement = '_sms';
      }
    } else if (value === 'ticket') {
      if (this.isSMSAvailable) {
        nextElement = '_sms';
      }
    }
    if (document.getElementById(this.selectedService.internalName.replace(/\s/g, '') + nextElement)) {
      document.getElementById(this.selectedService.internalName.replace(/\s/g, '') + nextElement).focus();
    }
  }
  KeyarrowRight(value: string) {
    let nextElement;
    if (value === 'sms') {
      if (this.isTicketAvailable) {
        nextElement = '_ticket';
      } else if (this.isTicketlessAvailable) {
        nextElement = '_ticketless';
      } else {
        nextElement = '';
      }
    } else if (value === 'ticket') {
      if (this.isTicketlessAvailable) {
        nextElement = '_ticketless';
      } else {
        nextElement = '';
      }
    } else if (value === 'ticketless') {
      nextElement = '';
    }
    if (document.getElementById(this.selectedService.internalName.replace(/\s/g, '') + nextElement)) {
      document.getElementById(this.selectedService.internalName.replace(/\s/g, '') + nextElement).focus();
    }
  }

}
