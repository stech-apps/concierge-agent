import { IService } from './../../../../models/IService';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors, ServicePointSelectors } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';
import { SPService } from 'src/util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/util/services/toast.service';

@Component({
  selector: 'qm-quick-serve',
  templateUrl: './qm-quick-serve.component.html',
  styleUrls: ['./qm-quick-serve.component.scss']
})
export class QmQuickServeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  services: IService[] = new Array<IService>();
  selectedService: IService;
  private selectedBranch: IBranch;
  private selectedServicePoint: IServicePoint;

  constructor(
    private serviceSelectors: ServiceSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private branchSelectors: BranchSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService
  ){
    const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => this.services = services);
    this.subscriptions.add(serviceSubscription);

    const servicePointSubscription = this.servicePointSelectors.openServicePoint$.subscribe((servicePoint) => this.selectedServicePoint = servicePoint);
    this.subscriptions.add(servicePointSubscription);

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
      this.selectedBranch = branch;
      if(branch){
        this.serviceDispatchers.fetchServices(branch);
      }
    });
    this.subscriptions.add(branchSubscription);
  }

  ngOnInit() {
    this.selectedService = null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onServiceSelect(selectedService: IService) {
    if(this.selectedService){
      this.selectedService = null;
    }
    else{
      this.selectedService = selectedService;
    }
  }

  onServe() {
    this.spService.quickServe(this.selectedBranch, this.selectedServicePoint, this.selectedService).subscribe((status: any) => {
      if(status){
        this.translateService.get('customer_served').subscribe(v => {
          this.toastService.infoToast(v + ' - ' + this.selectedService.internalName.toUpperCase());
          this.selectedService = null;
        });
      }
    });
  }
}
