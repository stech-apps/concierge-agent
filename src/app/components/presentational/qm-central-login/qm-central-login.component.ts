import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSelectors, BranchSelectors, CalendarBranchDispatchers, SystemInfoDispatchers, CalendarBranchSelectors } from '../../../../../src/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IAccount } from '../../../../models/IAccount';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from '../../../../util/services/rest/calendar.service';
import { HttpHeaders } from '@angular/common/http';
import { QueueService } from '../../../../util/services/queue.service';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';

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
  currentFlow: string;

  constructor(private translateService: TranslateService,
      private toastService: ToastService,
      private userSelectors: UserSelectors, 
      private router:Router,
      private branchSelector: BranchSelectors,
      private calendarService: CalendarService,
      private calendarBranchDispatcher: CalendarBranchDispatchers,
      private systemInfoDispatcher: SystemInfoDispatchers,
      private calendarBranchSelector: CalendarBranchSelectors,
      private route: ActivatedRoute,
      private queueService: QueueService,
      private errorHandler: GlobalErrorHandler
    ) {

    const userSubscription = this.userSelectors.user$.subscribe((user) => this.user = user);
    this.subscriptions.add(userSubscription);

    this.userDirection$ = this.userSelectors.userDirection$;

    const calendarBranchSubscription = this.calendarBranchSelector.branches$.subscribe((bs) => {
      if(bs && bs.length > 0){
        this.router.navigate(['home/' + this.currentFlow ]);
      }
    });
    this.subscriptions.add(calendarBranchSubscription);
  }

  ngOnInit() {
    this.formLogin = new FormGroup({
      userName: new FormControl({value: this.user.userName, disabled: true}, [Validators.required]),
      password:new FormControl('', [Validators.required])
    })

    const routerParams = this.route
      .queryParams
      .subscribe(params => {
        if(params){
          this.currentFlow = params.route;
        }
      });
    this.subscriptions.add(routerParams);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onCancel(){
    this.router.navigate(['home'])
    this.queueService.fetechQueueInfo();
  }

  onLogin(){
    let calendarBranchId: number;
    const selectedBranchSub = this.branchSelector.selectedBranch$.subscribe((branch => calendarBranchId = branch.id));
    this.subscriptions.add(selectedBranchSub);
    const calendarBranchSub = this.calendarBranchSelector.branches$.subscribe((branches => {
      if(branches && branches.length > 0){
        var selectedBranch = branches.filter(res => {
          return res.qpId === calendarBranchId;
        })
        if(selectedBranch){
          calendarBranchId = selectedBranch[0].id;
        }
      }
    }));
    this.subscriptions.add(calendarBranchSub);
  
    if (calendarBranchId && calendarBranchId > 0) {
      this.systemInfoDispatcher.setAuthorizationHeader(this.getAuthorizationHeader())
        this.calendarService.getBranchWithPublicId(calendarBranchId).subscribe(
          value => {
            if (value && value.branch.publicId) {
              this.calendarBranchDispatcher.fetchCalendarBranches();
            } else {
              this.translateService.get('no_central_access').subscribe(v => {
                this.toastService.infoToast(v);
              })
            }
          }, error => {
            this.systemInfoDispatcher.resetAuthorizationHeader();
            if(error.status === 401){
              this.translateService.get('login_failed').subscribe(v => {
                this.errorHandler.showError(v, null);
              });
            }
            else{
              this.translateService.get('no_central_access').subscribe(v => {
                this.toastService.infoToast(v);
              });
            }
          }
        );
    }
  }

  getAuthorizationHeader() : HttpHeaders{
    var headers = new HttpHeaders();
    const formModel = this.formLogin.value;
    var authKey = btoa(this.user.userName + ":" + formModel.password as string)
    headers = headers.append('Authorization', 'Basic ' + authKey);
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-Type', 'application/json');

    return headers;
  }

  
}
