import { NativeApiService } from './../util/services/native-api.service';
// Route guards
import { LicenseAuthGuard } from 'src/auth-guards/license-auth-guard';


// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Components
import { AppComponent } from './app.component';

// Routes
import { appRoutes } from './../routes/app-routes';

// NGRX Store
import { StoreModule, Store, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Store setup
import { reducers } from '../store/reducers';
import { effects } from '../store/effects';

// Env
import { environment } from '../environments/environment';

// Translations
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';

// services
import {
  storeServices
} from '../store';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';
import { ToastService } from './../util/services/toast.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpLoaderFactory } from 'src/i18n/TranslationsLoaderFactory';
import { LicenseDispatchers } from './../store/services/license/license.dispatchers';
import { QmAppLoaderComponent } from './components/containers/qm-app-loader/qm-app-loader.component';
import { QmAppComponent } from './components/containers/qm-app/qm-app.component';
import { QmInvalidLicenseComponent } from './components/presentational/qm-invalid-license/qm-invalid-license.component';
import { QmAppPageNotFoundComponent } from './components/presentational/qm-app-page-not-found/qm-app-page-not-found.component';
import { Router } from '@angular/router';
import { PlatformDispatchers } from 'src/store/services/platform';

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
    QmAppPageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    ToastrModule.forRoot(toastrGlobalOptions),
    ...(!environment.production
      ? [StoreDevtoolsModule.instrument({ maxAge: 10 })]
      : []),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ...storeServices,
    GlobalErrorHandler,
    ToastService,
    LicenseAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor( private translate: TranslateService, 
    private licenseInfoDispatchers: LicenseDispatchers, private nativeApiService: NativeApiService,
    private router: Router, private platformDispatchers: PlatformDispatchers) {
    this.translate.setDefaultLang('connectConciergeMessages');

    this.platformDispatchers.updatePlatform(this.nativeApiService.getPlatform());

    if(!this.nativeApiService.isNativeBrowser()) {
      this.licenseInfoDispatchers.fetchLicenseInfo(); // only fetch license in desktop
      this.router.navigate(['/loading']);
    }
    else {
      this.router.navigate(['/app']);
    }
  }
}
