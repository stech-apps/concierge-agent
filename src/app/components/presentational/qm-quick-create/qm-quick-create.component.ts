import { UserSelectors } from 'src/store/services';
import { IService } from './../../../../models/IService';
import { Subscription, Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors, ServicePointSelectors } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';
import { SPService } from 'src/util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/util/services/toast.service';
import { IServiceConfiguration } from '../../../../models/IServiceConfiguration';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';

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

  constructor(
    private serviceSelectors: ServiceSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private branchSelectors: BranchSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private userSelectors: UserSelectors
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

    const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => {
      if (services.length === 0) {
        this.serviceDispatchers.fetchServices(this.selectedBranch);
      } else {
        this.services = services;
        this.sortServiceList();
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

  onCreate() {
    this.showToolTip = false;
    this.spService.quickServe(this.selectedBranch, this.selectedServicePoint, this.selectedService).subscribe((status: any) => {
      if (status) {
        this.translateService.get('quick_serve_toast').subscribe(v => {
          this.toastService.infoToast(this.selectedService.internalName + ' ' + v);
          this.selectedService = null;
          const searchBox = document.getElementById('visitSearch') as any;
          searchBox.value = '';
          this.filterText = '';
        });
      } else {
        this.toastService.errorToast('error');
      }
    }
  );

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
      this.services = this.services.sort((a, b) => {
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

}
