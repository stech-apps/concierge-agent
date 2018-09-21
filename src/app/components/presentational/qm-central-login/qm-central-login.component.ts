import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSelectors, BranchSelectors, CalendarBranchDispatchers } from '../../../../../src/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Router } from '@angular/router';
import { IAccount } from '../../../../models/IAccount';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from '../../../../util/services/rest/calendar.service';

@Component({
  selector: 'qm-central-login',
  templateUrl: './qm-central-login.component.html',
  styleUrls: ['./qm-central-login.component.scss']
})
export class QmCentralLoginComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  userDirection$: Observable<string>;
  user: IAccount;
  formLogin: FormGroup;

  constructor(private translateService: TranslateService,
      private toastService: ToastService,
      private userSelectors: UserSelectors, 
      private router:Router,
      private branchSelector: BranchSelectors,
      private calendarService: CalendarService,
      private calendarBranchDispatcher: CalendarBranchDispatchers
    ) {
      
    const userSubscription = this.userSelectors.user$.subscribe((user) => this.user = user);
    this.subscriptions.add(userSubscription);

    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {
    this.formLogin = new FormGroup({
      userName: new FormControl(this.user.userName, [Validators.required]),
      password:new FormControl('', [Validators.required])
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onCancel(){
    this.router.navigate(['home'])
  }

  onLogin(){
    let calendarBranchId: number;
    const selectedBranchSub = this.branchSelector.selectedBranch$.subscribe((branch => calendarBranchId = branch.id));
    this.subscriptions.add(selectedBranchSub);
  
    if (calendarBranchId && calendarBranchId > 0) {
        this.calendarService.getBranchWithPublicId(calendarBranchId).subscribe(
          value => {
            if (value && value.branch.publicId) {
              this.calendarBranchDispatcher.fetchCalendarBranches();
              this.router.navigate(['home/create-appointment']);
            } else {
              this.translateService.get('no_central_access').subscribe(v => {
                this.toastService.infoToast(v);
              })
            }
          }, error => {
            this.translateService.get('no_central_access').subscribe(v => {
              this.toastService.infoToast(v);
            });
          }
        );
    }
  }
}
