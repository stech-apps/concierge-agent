import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { QmInputboxComponent } from '../../app/components/presentational/qm-inputbox/qm-inputbox.component';
import { Subscription } from 'rxjs';
import { ICustomer } from '../../models/ICustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerUpdateService {

  constructor(
    private modalService:NgbModal,
    private translate:TranslateService
  ) { }

  public open(
  
    update?:string
     ): Promise<boolean> {
    const modalRef = this.modalService.open(QmInputboxComponent, {
      centered: true
    });
    if(update){
      modalRef.componentInstance.isOnupdate = true;
   
    } else{
      modalRef.componentInstance.isOnupdate = false;
   
    }
    return modalRef.result;
  }

 
}
