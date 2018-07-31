import { QmFlowPanelTitle } from './components/containers/qm-flow-panel-header/qm-flow-panel-title.directive';
import { QmFlowPanelResult } from './components/containers/qm-flow-panel-header/qm-flow-panel-result.directive';
import { QueueIndicator } from './../util/services/queue-indication.helper';
import { ServicePointSelectors } from './../store/services';

import { QmCustomToastComponent } from "./components/presentational/qm-custom-toast/qm-custom-toast.component";
import { NativeApiService } from "./../util/services/native-api.service";
// Route guards
import { LicenseAuthGuard } from "src/auth-guards/license-auth-guard";

// Angular Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

// Components
import { AppComponent } from "./app.component";
import { QmQuickServeComponent } from "src/app/components/presentational/qm-quick-serve/qm-quick-serve.component";

// Routes
import { appRoutes } from "./../routes/app-routes";

// NGRX Store
import { StoreModule, Store, ActionReducer, MetaReducer } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

// Store setup
import { reducers } from "../store/reducers";
import { effects } from "../store/effects";

// Env
import { environment } from "../environments/environment";

//Forms
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule
} from "@angular/forms";

// Translations
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from "@ngx-translate/core";

// services
import { storeServices } from "../store";
import { GlobalErrorHandler } from "src/util/services/global-error-handler.service";
import { ToastService } from "./../util/services/toast.service";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { HttpLoaderFactory } from "src/i18n/TranslationsLoaderFactory";
import { LicenseDispatchers } from "./../store/services/license/license.dispatchers";
import { QmAppLoaderComponent } from "./components/containers/qm-app-loader/qm-app-loader.component";
import { QmAppComponent } from "./components/containers/qm-app/qm-app.component";
import { QmInvalidLicenseComponent } from "./components/presentational/qm-invalid-license/qm-invalid-license.component";
import { QmAppPageNotFoundComponent } from "./components/presentational/qm-app-page-not-found/qm-app-page-not-found.component";
import { Router } from "@angular/router";
import { PlatformDispatchers } from "src/store/services/platform";
import { QmProfileComponent } from "./components/presentational/qm-profile/qm-profile.component";
import { QmPageHeaderComponent } from "./components/containers/qm-page-header/qm-page-header.component";
import { QmDropDownComponent } from "./components/presentational/qm-drop-down/qm-drop-down.component";
import { QEvents } from "src/util/services/qevents/qevents.service";
import { QEventsHelper } from "src/util/services/qevents/qevents";
import { QmAutoCloseComponent } from "./components/containers/qm-auto-close/qm-auto-close.component";
import { AutoClose } from "../util/services/autoclose.service";
import { QmHomeComponent } from "src/app/components/presentational/qm-home/qm-home.component";
import { Logout } from "./../util/services/logout.service";
import { QmSideMenuComponent } from "./components/containers/qm-side-menu/qm-side-menu.component";
import { SPService } from "./../util/services/rest/sp.service";
import { Util } from "./../util/util";
import { QmHomeMenuComponent } from "./components/containers/qm-home-menu/qm-home-menu.component";
import { QmQueueSummaryComponent } from "./components/presentational/qm-queue-summary/qm-queue-summary.component";
import { LoginService } from "src/util/services/login.service";
import { QmQueueListComponent } from "./components/presentational/qm-queue-list/qm-queue-list.component";
import { QmModalComponent } from "./components/presentational/qm-modal/qm-modal.component";
import { QmModalService } from "./components/presentational/qm-modal/qm-modal.service";

// Ng Bootstrap, used for modals
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { QmCustomersComponent } from "./components/presentational/qm-customers/qm-customers.component";
import { QmCustomerSearchComponent } from "./components/presentational/qm-customer-search/qm-customer-search.component";
import { QmCustomerCreateComponent } from "./components/presentational/qm-customer-create/qm-customer-create.component";
import { QmFlowComponent } from './components/containers/qm-flow/qm-flow.component';
import { QmFlowPanelComponent } from './components/containers/qm-flow-panel/qm-flow-panel.component';
import { QmFlowPanelHeaderComponent } from './components/containers/qm-flow-panel-header/qm-flow-panel-header.component';
import { QmCreateAppointmentComponent } from './components/presentational/qm-create-appointment/qm-create-appointment.component';
import { QmSelectBranchComponent } from './components/presentational/qm-select-branch/qm-select-branch.component';
import { QmFlowPanelContentComponent } from './components/containers/qm-flow-panel-content/qm-flow-panel-content.component';
import { QmFlowPanelHeaderLeftDirective } from './components/containers/qm-flow-panel-header/qm-flow-panel-header-left.directive';
import { QmCreateVisitComponent } from './components/presentational/qm-create-visit/qm-create-visit.component';

import { QmReservationTimerComponent } from "./components/containers/qm-reservation-timer/qm-reservation-timer.component";
import { QmInputboxComponent } from './components/presentational/qm-inputbox/qm-inputbox.component';

import { TimeUtils } from "../util/services/timeUtils.service";
import { CalendarSettingsService } from "../store/services/calendar-settings/calendar-settings.service";

// Global options for Toastr
const toastrGlobalOptions = {
  maxOpened: 3,
  autoDismiss: true,
  iconClasses: {}
};

@NgModule({
  declarations: [
    AppComponent,
    QmAppLoaderComponent,
    QmAppComponent,
    QmInvalidLicenseComponent,
    QmAppPageNotFoundComponent,
    QmProfileComponent,
    QmPageHeaderComponent,
    QmDropDownComponent,
    QmCustomToastComponent,
    QmAutoCloseComponent,
    QmHomeComponent,
    QmSideMenuComponent,
    QmQuickServeComponent,
    QmHomeMenuComponent,
    QmQueueSummaryComponent,
    QmQueueListComponent,
    QmModalComponent,
    QmFlowComponent,
    QmFlowPanelComponent,
    QmFlowPanelHeaderComponent,
    QmFlowPanelResult,
    QmFlowPanelTitle,
    QmCreateAppointmentComponent,
    QmSelectBranchComponent,
    QmFlowPanelContentComponent,
    QmFlowPanelHeaderLeftDirective,
    QmCustomersComponent,
    QmCustomerSearchComponent,
    QmCustomerCreateComponent,
    QmReservationTimerComponent,
    QmInputboxComponent,
    QmCreateVisitComponent
  
  ],
  entryComponents: [
    QmCustomToastComponent,
    QmModalComponent,
    QmInputboxComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    ToastrModule.forRoot(toastrGlobalOptions),
    ToastContainerModule,
    ...(!environment.production
      ? [StoreDevtoolsModule.instrument({ maxAge: 10 })]
      : []),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NgbModule.forRoot()
  ],
  providers: [
    ...storeServices,
    GlobalErrorHandler,
    ToastService,
    LicenseAuthGuard,
    QEvents,
    QEventsHelper,
    QueueIndicator,
    AutoClose,
    Logout,
    SPService,
    Util,
    LoginService,
    QmModalService,
    TimeUtils,
    CalendarSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private licenseInfoDispatchers: LicenseDispatchers,
    private nativeApiService: NativeApiService,
    private router: Router,
    private platformDispatchers: PlatformDispatchers,
    private servicePointSelectors: ServicePointSelectors,
    private util: Util
  ) {
    this.translate.setDefaultLang("connectConciergeMessages");
    this.platformDispatchers.updatePlatform(
      this.nativeApiService.getPlatform()
    );

    this.servicePointSelectors.openServicePoint$.subscribe(openSp => {
      this.util.setApplicationTheme(openSp);
    });

    if (this.nativeApiService.isNativeBrowser()) {
      this.nativeApiService.showNativeLoader(false);
      this.router.navigate(["/profile"]);
    } else {
      this.licenseInfoDispatchers.fetchLicenseInfo(); // only fetch license in desktop
      this.router.navigate(["/loading"]);
    }
  }
}
