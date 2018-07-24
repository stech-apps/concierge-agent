import { Observable } from 'rxjs';
import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { CREATE_VISIT, EDIT_VISIT, CREATE_APPOINTMENT, EDIT_APPOINTMENT, ARRIVE_APPOINTMENT } from './../../../../constants/utt-parameters';
import { UserRole } from './../../../../models/UserPermissionsEnum';
import { Component, OnInit } from '@angular/core';
import { AccountSelectors, ServicePointSelectors } from 'src/store';

@Component({
  selector: 'qm-home-menu',
  templateUrl: './qm-home-menu.component.html',
  styleUrls: ['./qm-home-menu.component.scss']
})
export class QmHomeMenuComponent implements OnInit {


  //user permissions
  isVisitUser = false;
  isAppointmentUser = false;

  // final flow permissions
  isCreateVisit = false;
  isEditVisit = false;
  isArriveAppointment = false;
  isEditAppointment = false;
  isCreateAppointment = false;
  userDirection$: Observable<string>;


  constructor(private accountSelectors: AccountSelectors, private servicePointSelectors: ServicePointSelectors, private userSelectors: UserSelectors) { 
   
  }

  ngOnInit() {
    this.checkUserPermissions();
    this.checkUttPermissions();
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  checkUttPermissions() {
    this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {

      if (this.isVisitUser) {
        this.isCreateVisit = uttpParams[CREATE_VISIT];
        this.isEditVisit = uttpParams[EDIT_VISIT];
      }
      else {
        this.isCreateVisit = false;
        this.isEditVisit = false;
      }

      if (this.isAppointmentUser) {
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
}
