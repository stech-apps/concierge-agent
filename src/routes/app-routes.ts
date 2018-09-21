import { QmEditAppointmentComponent } from './../app/components/presentational/qm-edit-appointment/qm-edit-appointment.component';
import { QmProfileComponent } from '../app/components/presentational/qm-profile/qm-profile.component';
import { QmCustomersComponent } from '../app/components/presentational/qm-customers/qm-customers.component';
import { QmAppPageNotFoundComponent } from '../app/components/presentational/qm-app-page-not-found/qm-app-page-not-found.component';
import { QmAppComponent } from '../app/components/containers/qm-app/qm-app.component';
import { QmAppLoaderComponent } from '../app/components/containers/qm-app-loader/qm-app-loader.component';
import { AppComponent } from '../app/app.component';
import { RouterModule, Routes } from '@angular/router';
import { LicenseAuthGuard } from 'src/auth-guards/license-auth-guard';
import { QmInvalidLicenseComponent } from 'src/app/components/presentational/qm-invalid-license/qm-invalid-license.component';
import { QmHomeComponent } from 'src/app/components/presentational/qm-home/qm-home.component';
import { QmCreateAppointmentComponent } from 'src/app/components/presentational/qm-create-appointment/qm-create-appointment.component';
import { QmCreateVisitComponent } from '../app/components/presentational/qm-create-visit/qm-create-visit.component';
import { QmArriveAppointmentComponent } from 'src/app/components/presentational/qm-arrive-appointment/qm-arrive-appointment.component';
import { QmEditVisitComponent } from '../app/components/presentational/qm-edit-visit/qm-edit-visit.component';
import { QmCentralLoginComponent } from 'src/app/components/presentational/qm-central-login/qm-central-login.component';
export const appRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'loading', component: QmAppLoaderComponent },
      { path: 'app', component: QmAppComponent, canActivate: [LicenseAuthGuard] },
      { path: 'invalid-license', component: QmInvalidLicenseComponent },

      {
        path: 'home', component: QmHomeComponent, children: [
          { path: 'create-appointment', component: QmCreateAppointmentComponent },
          { path: 'create-visit', component: QmCreateVisitComponent },
          { path: 'arrive-appointment', component: QmArriveAppointmentComponent },
          { path: 'edit-appointment', component: QmEditAppointmentComponent },
          { path: 'edit-visit', component: QmEditVisitComponent },
          { path: 'central-login', component: QmCentralLoginComponent}
        ]
      },
      { path: 'profile', component: QmProfileComponent },
 { path: 'customers', component: QmCustomersComponent},
      { path: '**', component: QmAppPageNotFoundComponent }
    ]
  }
];
