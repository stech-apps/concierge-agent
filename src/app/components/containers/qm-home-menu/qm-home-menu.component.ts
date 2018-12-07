import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { CREATE_VISIT, EDIT_VISIT, CREATE_APPOINTMENT, EDIT_APPOINTMENT, ARRIVE_APPOINTMENT } from './../../../../constants/utt-parameters';
import { UserRole } from './../../../../models/UserPermissionsEnum';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountSelectors, ServicePointSelectors, CalendarBranchDispatchers, BranchSelectors, InfoMsgDispatchers, SystemInfoSelectors, CalendarBranchSelectors, LicenseInfoSelectors, SystemInfoDataService } from 'src/store';

import { ToastService } from '../../../../util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { QueueService } from '../../../../util/services/queue.service';
import { Recycle } from '../../../../util/services/recycle.service';
import { CalendarService } from '../../../../util/services/rest/calendar.service';
import { ICalendarBranch } from '../../../../models/ICalendarBranch';
import { ICalendarBranchCentralResponse } from '../../../../models/ICalendarBranchCentralResponse';
import { ActiveToast } from 'ngx-toastr';
import { NativeApiService } from '../../../../util/services/native-api.service';
import { ISystemInfo } from '../../../../models/ISystemInfo';

@Component({
  selector: 'qm-home-menu',
  templateUrl: './qm-home-menu.component.html',
  styleUrls: ['./qm-home-menu.component.scss']
})
export class QmHomeMenuComponent implements OnInit, OnDestroy {



  //user permissions
  isVisitUser = false;
  isAppointmentUser = false;
  isAllOutputMethodsDisabled: boolean;
  printerEnabled: boolean;

  // final flow permissions
  isCreateVisit = false;
  isEditVisit = false;
  isArriveAppointment = false;
  isEditAppointment = false;
  isCreateAppointment = false;
  userDirection$: Observable<string>;

  isEditFlowDisabled = false;
  isEditVisitFlowDisabled = false;

  hostAddressStr:string;
  menuItemEnable:boolean;

  //putting menuItem Names to a 2D array by splitting the words in to half chunks
  menuItemWordArray=new Array();;

  public systemInformation$: Observable<ISystemInfo>;
  public licenseIsValid$: Observable<boolean>;

  private subscriptions: Subscription = new Subscription();


  constructor(private accountSelectors: AccountSelectors, private servicePointSelectors: ServicePointSelectors, private router: Router,
    private userSelectors: UserSelectors, private calendarBranchDispatcher: CalendarBranchDispatchers,
    private toastService: ToastService, private translateService: TranslateService,
    private InfoMsgBoxDispatcher: InfoMsgDispatchers, private recycleService: Recycle, private queueService: QueueService, private calendarService: CalendarService, private systemInfoService: SystemInfoDataService, private branchSelector: BranchSelectors,
    private systemInfoSelectors: SystemInfoSelectors, private calendarBranchSelector: CalendarBranchSelectors, private nativeApi: NativeApiService, private licenseInfoSelectors: LicenseInfoSelectors) {

  }

  ngOnInit() {
    const hostAddressSub = this.systemInfoSelectors.systemInfoHostAddress$.subscribe(hostAddress => {
      this.hostAddressStr = hostAddress;
    });
    this.subscriptions.add(hostAddressSub);
    this.checkUserPermissions();
    this.checkUttPermissions();
    this.userDirection$ = this.userSelectors.userDirection$;
    console.log(this.userDirection$);
    
    if (this.isAppointmentUser && (this.isCreateAppointment || this.isEditAppointment || this.isArriveAppointment) && this.hostAddressStr) {
      this.calendarBranchDispatcher.fetchCalendarBranches();
    }

    const AccountSubscriptions = this.accountSelectors.MenuItemStatus.subscribe(status=>{
        this.menuItemEnable = status;
    });
    this.subscriptions.add(AccountSubscriptions);

    this.systemInformation$ = this.systemInfoSelectors.systemInfo$;
    this.licenseIsValid$ = this.licenseInfoSelectors.isValidLicense$;

    //passing menu item names to add to the 2d array
    this.wordSplitter('create_appointment_single_line')
    this.wordSplitter('edit_appointment_single_line')
    this.wordSplitter('arrive_appointment_single_line')
    this.wordSplitter('create_visit_single_line')
    this.wordSplitter('edit_visit_single_line')
     
  }


  checkUttPermissions() {
    this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {
      if (uttpParams) {
        if (!uttpParams.sndEmail && !uttpParams.sndSMS && !uttpParams.ticketLess) {
          this.isAllOutputMethodsDisabled = true;
        }
        this.printerEnabled = uttpParams.printerEnable;

        if (!uttpParams.delAppointment && !uttpParams.reSheduleAppointment) {
          this.isEditFlowDisabled = true;
        }

        var canCherryPick = uttpParams.cherryPick;
        if(!canCherryPick){
            canCherryPick = false;
        }
        var canTransferSP = uttpParams.trServPool;
        var canTransferQ = uttpParams.btnQueueTransfer;
        var canTransferStaff = uttpParams.trUserPool;
        var canTransferQFirst = uttpParams.btnTransferFirst;
        var canTransferQLast = uttpParams.btnTransferLast;
        var canTransferQWait = uttpParams.btnTransferSort;
        var canDelete = uttpParams.delVisit;
        if (canDelete == false && canCherryPick == false && canTransferSP == false && canTransferQ == false && canTransferStaff == false &&
           (canTransferQ == false || (canTransferQ == true && canTransferQFirst == false && canTransferQLast == false && canTransferQWait == false))) {
            this.isEditVisitFlowDisabled =true;
        }
      }

      if (this.isVisitUser && uttpParams) {
        this.isCreateVisit = uttpParams[CREATE_VISIT];
        this.isEditVisit = uttpParams[EDIT_VISIT];
      }
      else {
        this.isCreateVisit = false;
        this.isEditVisit = false;
      }

      if (this.isAppointmentUser && uttpParams) {
        this.isCreateAppointment = uttpParams[CREATE_APPOINTMENT];
        this.isEditAppointment = uttpParams[EDIT_APPOINTMENT];
        this.isArriveAppointment = uttpParams[ARRIVE_APPOINTMENT];
      }
      else {
        this.isCreateAppointment = false;
        this.isEditAppointment = false;
        this.isArriveAppointment = false;
      }
    });
  }

  checkUserPermissions() {
    this.accountSelectors.userRole$.subscribe((ur: UserRole) => {
      if (ur && UserRole.All) {
        this.isAppointmentUser = true;
        this.isVisitUser = true;
      }
      else if (ur && UserRole.AppointmentUserRole) {
        this.isAppointmentUser = true;
      }
      else if (ur & UserRole.VisitUserRole) {
        this.isVisitUser = true;
      }
    });
  }

  handleMenuItemClick(route) {
    this.InfoMsgBoxDispatcher.resetInfoMsgBoxInfo();
    // initial check for central connectivity
    if (route === 'create-appointment' || route === 'edit-appointment') {
      let calendarBranchId: number;
      const selectedBranchSub = this.branchSelector.selectedBranch$.subscribe((branch => calendarBranchId = branch.id));
      this.subscriptions.add(selectedBranchSub);
      const calendarBranchSub = this.calendarBranchSelector.branches$.subscribe((branches => {
        if (branches && branches.length > 0){
          var selectedBranch = branches.filter(res => {
            return res.qpId === calendarBranchId;
          });
          if (selectedBranch) {
            calendarBranchId = selectedBranch[0].id;
          }
        }
      }));
      this.subscriptions.add(calendarBranchSub);

      if (calendarBranchId && calendarBranchId > 0) {
        // insert hostaddress if using QAgent(OnHold)
          // this.calendarService.getBranchWithPublicId(calendarBranchId).subscribe(
          this.calendarService.getCalendarSettingsSystemInfo().subscribe(
          value => {
            // if (value && value.branch.publicId) {
              if (value && value.productName) {
                this.handleUttRequirements(route);
            } else {
              this.translateService.get('no_central_access').subscribe(v => {
                this.toastService.infoToast(v);
              });
            }
          }, error => {
            if (error.status === 401) {
              this.router.navigate(['home/central-login'], { queryParams : {route} });
            } else {
              this.translateService.get('no_central_access').subscribe(v => {
                this.toastService.infoToast(v);
              });
            }
          }
        );
      }
    } else {
      this.handleUttRequirements(route);
    }

  }

  handleUttRequirements(route) {
    if (this.isAllOutputMethodsDisabled && route == 'create-appointment') {
      this.translateService.get('no_notification_methods').subscribe(v => {
        this.toastService.infoToast(v);
      })
    } else if (this.isAllOutputMethodsDisabled && route == 'arrive-appointment' && !this.printerEnabled) {
      this.translateService.get('no_notification_methods').subscribe(v => {
        this.toastService.infoToast(v);
      })
    } else if (this.isAllOutputMethodsDisabled && route == 'create-visit' && !this.printerEnabled) {
      this.translateService.get('no_notification_methods').subscribe(v => {
        this.toastService.infoToast(v);
      })
    }
    else if (route == 'edit-appointment' && this.isEditFlowDisabled) {
      this.translateService.get('no_actions_available').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else {
      this.recycleService.clearCache();
      this.queueService.stopQueuePoll();
      this.router.navigate(['home/' + route]);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  hasValidLicense (systemInfo) {
    return systemInfo.licenseCompanyName !== null && systemInfo.licenseCompanyName !== '';
  }

  //splitting menu item words from the language varibles in to two chunks and adding them to a 2d array (to support ie 11 issue of not properly hiding the words when it overflow)
  wordSplitter(Word){
    this.translateService.get(Word).subscribe(v => {
      let menuName = v;
      //splitting menu item name by spaces
      let splitedName = menuName.split(" ");
      //sclicing menu item name in to two chunks
        let firstArray = splitedName.slice(0,Math.floor(splitedName.length / 2)).toString().replace(/,/g, ' ');
        let secondArray = splitedName.slice(Math.floor(splitedName.length / 2),splitedName.length).toString().replace(/,/g, ' ');
        this.menuItemWordArray.push([firstArray, secondArray]);
    })
  }
}
