import { Logout } from "./../../../../util/services/logout.service";
import { AutoClose } from "./../../../../util/services/autoclose.service";
import { IService } from "./../../../../models/IService";

import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from "@angular/core";

import { Observable } from "rxjs";

import {
  UserSelectors,
  LicenseInfoSelectors,
  ServicePointSelectors,
  BranchSelectors,
  AppointmentDispatchers,
  ReserveDispatchers,
  QueueDispatchers,
  FlowOpenSelectors,
  ServicePointDispatchers
} from "../../../../store";

import { NativeApiService } from "../../../../util/services/native-api.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_URL } from "src/util/url-helper";

import { IServicePoint } from "../../../../models/IServicePoint";
import { IBranch } from "../../../../models/IBranch";

@Component({
  selector: "qm-page-header",
  templateUrl: "./qm-page-header.component.html",
  styleUrls: ["./qm-page-header.component.scss"]
})
export class QmPageHeaderComponent implements OnInit, OnDestroy {
  brandLogoSrc = "assets/images/brand_logo_header.png";
  userFullName$: Observable<string>;
  userDirection$: Observable<string>;
  userIsAdmin$: Observable<boolean>;
  selectedServices$: Observable<IService[]>;
  selectedServices: IService[] = [];
  headerSubscriptions: Subscription = new Subscription();
  isTimeSlotSelected: boolean;
  selectedTime$: Observable<string>;
  private isValidLicense$: Observable<boolean>;
  private isValidLicense: boolean;
  isNative: boolean;
  servicePoint$: Observable<IServicePoint>;
  branchName: string;
  private branch$: Observable<IBranch>;
  showBranch = false;
  showSPointName:boolean = false;
  sPName:string;
  userDirections: string;
  isFlowOpen:boolean;
  isQuickServeEnable:boolean;
  isHome: boolean;
  isCreateVisit = false;
  isArriveAppointment = false;
  isEditAppointment = false;
  isCreateAppointment = false;

  @Output()
  clickBackToAppointmentsPage: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  handleHeaderNavigations: EventEmitter<string> = new EventEmitter<string>();

  @Input() isPreventHeaderNavigations = false;

  constructor(
    
   
    private userSelectors: UserSelectors,
    public route: ActivatedRoute,
    public autoCloseService: AutoClose,
    private router: Router,
    private logoutService: Logout,
    private licenseInfoSelectors: LicenseInfoSelectors,
    private nativeApiService: NativeApiService,
    private branchSelectors: BranchSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private reserveDispatchers:ReserveDispatchers,
    private queueDispatchers: QueueDispatchers,
    private flowOpenSelectors:FlowOpenSelectors,
    private servicePointDispatchers:ServicePointDispatchers,
    
  ) {
    this.userFullName$ = this.userSelectors.userFullName$;
    this.userDirection$ = this.userSelectors.userDirection$;
    this.isValidLicense$ = this.licenseInfoSelectors.isValidLicense$;
    this.servicePoint$ = this.servicePointSelectors.openServicePoint$;
    this.branch$ = this.branchSelectors.selectedBranch$;
    this.isNative = this.nativeApiService.isNativeBrowser();
    this.isFlowOpen = false;
    
  }

  ngOnInit() {
    
    const userDirectionSubscription = this.userSelectors.userDirection$.subscribe(direction=>{
      this.userDirections = direction;
      
    });
    this.headerSubscriptions.add(userDirectionSubscription);    
    
    const licenseSubscription = this.isValidLicense$.subscribe(
      (licenseIsValid: boolean) => {
        this.isValidLicense = licenseIsValid;
      }
    );
    this.headerSubscriptions.add(licenseSubscription);

    
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      params => {
        if (params) {
          this.isQuickServeEnable = params.quickServe;       
        }
      }
    );
    this.headerSubscriptions.add(servicePointsSubscription);



    const servicePointSubscription = this.servicePoint$.subscribe(
      (servicePoint: IServicePoint) => {
        if (servicePoint) {
          this.showBranch = true;
          this.showSPointName = true;
          this.sPName = servicePoint.name;
          this.servicePointDispatchers.setPreviousServicePoint(servicePoint);
        }
       
      }
    );
    this.headerSubscriptions.add(servicePointSubscription);

    const branchSubscription = this.branch$.subscribe((branch: IBranch) => {
      this.branchName = branch.name;
    });
    this.headerSubscriptions.add(branchSubscription);

    const flowOpenSubscription = this.flowOpenSelectors.FlowOpen$.subscribe(status=>{
      this.isFlowOpen = status;
    });
    this.headerSubscriptions.add(flowOpenSubscription);
    this.isHome = true;
    this.router.events.subscribe((event) => {
      if (this.router.url=="/home"){
        this.isHome = true;
      } else {
        this.isHome = false;
    }
  });
  
  }
  ngOnDestroy() {
    this.headerSubscriptions.unsubscribe();
  }

  logout(event: Event) {
    this.reserveDispatchers.unreserveAppointment();
    event.preventDefault();
    this.logoutService.logout(false);
  }

  homeClick($event) {
    $event.preventDefault();
    window.location.href = APP_URL;
  }

  hasValidLicense(): boolean {
    return this.isValidLicense;
  }
  editClick(){
    this.router.navigate(['/profile']);
    this.queueDispatchers.resetSelectedQueue();
    this.queueDispatchers.setectVisit(null);
    this.queueDispatchers.resetFetchVisitError();
    
  }
  QuickServeFocus() {
    if(document.getElementById("quick_serve_tooltip")) {
      document.getElementById("quick_serve_tooltip").focus();
    }
  }
  MenuBarFocus() {
    if(document.getElementById("create_appointment")) {
      document.getElementById("create_appointment").focus();
    }
  }
}
