import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store/src/models';;
import { CustomerDataService } from "../services/customer/customer-data.service";
import { ToastService } from "../../util/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { GlobalErrorHandler } from "../../util/services/global-error-handler.service";
import { Effect,Actions } from "@ngrx/effects";
import { Observable } from 'rxjs';
import * as CustomerActions from './../actions'
import { switchMap,tap } from "../../../node_modules/rxjs/operators";


const toAction = CustomerActions.toAction();
@Injectable()
export class CustomerEffects{
    constructor( 
        private actions$ : Actions,
        private customerDataService:CustomerDataService,
        private toastService:ToastService,
        private translateService:TranslateService,
        private globalErrorHandler:GlobalErrorHandler
    ){}

    @Effect()
    getCustomers$: Observable<Action> = this.actions$
      .ofType(CustomerActions.FETCH_CUSTOMERS)
      .pipe(
        switchMap((action: CustomerActions.FetchCustomers) => {
            return toAction(
              this.customerDataService.getCustomers(action.payload),
              CustomerActions.FetchCustomersSuccess,
              CustomerActions.FetchCustomersFail
            );
          }
        )
      );
    
      @Effect()
      createCustomer$: Observable<Action> = this.actions$
        .ofType(CustomerActions.CREATE_CUSTOMER)
        .pipe(
          switchMap((action: CustomerActions.CreateCustomer) => {
              return toAction(
                this.customerDataService.createCustomer(action.payload),
                CustomerActions.CreateCustomerSuccess,
                CustomerActions.CreateCustomerFail
              );
            }
          )
        );
    
        @Effect()
        selectCustomerAfterCreation$: Observable<Action> = this.actions$
          .ofType(CustomerActions.CREATE_CUSTOMER_SUCCESS)
          .pipe(
            tap((action: CustomerActions.CreateCustomerSuccess) =>             
              this.translateService.get('customer_msg_created',{0:action.payload.firstName+' '+action.payload.lastName}).subscribe(
                  (label:string) => this.toastService.successToast(label)
              ).unsubscribe()
            ),
            switchMap((action:CustomerActions.CreateCustomerSuccess)=>
            [new CustomerActions.SelectCustomer(action.payload)]
          ));
        
        @Effect({dispatch:false})
        createCustomerFailed$: Observable<Action> = this.actions$
            .ofType(CustomerActions.CREATE_CUSTOMER_FAIL)
            .pipe(
              tap((action: CustomerActions.CreateCustomerFail) =>             
                {
                    this.globalErrorHandler
                        .showError('customer_msg_created_error',action.payload);
                }
              ))
        
        @Effect()
        updateCustomer$:Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER)
        .pipe(
            switchMap((action:CustomerActions.UpdateCustomer)=>{
                return toAction(
                    this.customerDataService.updateCustomer(action.payload),
                    CustomerActions.UpdateCUstomerSuccess,
                    CustomerActions.UpdateCustomerFail
                )
            })
        );

        @Effect()
        selectCustomerAfterUpdate$: Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER_SUCCESS)
        .pipe(
            tap((action:CustomerActions.UpdateCUstomerSuccess)=>
            this.translateService.get('customer_msg_update').subscribe(
                (label:string)=> this.toastService.successToast(`${label}`)
            ).unsubscribe()
        ),
        switchMap((action:CustomerActions.UpdateCUstomerSuccess)=>
        [new CustomerActions.SelectCustomer(action.payload)]
        )
        );

  
        @Effect({dispatch:false})
        updateCustomerFailed$: Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER_FAIL)
        .pipe(
            tap((action:CustomerActions.UpdateCustomerFail)=>{
                this.globalErrorHandler
                .showError('customer_msg_update_error',action.payload);
            }
        ));

        @Effect()
        updateCustomerWithoutToast$:Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER_NO_TOAST)
        .pipe(
            switchMap((action:CustomerActions.UpdateCustomerWithoutToast)=>{
                return toAction(
                    this.customerDataService.updateCustomer(action.payload),
                    CustomerActions.UpdateCustomerWithoutToastSuccess,
                    CustomerActions.UpdateCustomerWithoutToastFail
                )
            })
        );

        
        @Effect()
        updateCustomerWithoutToastSuccess$: Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER_NO_TOAST_SUCCESS)
        .pipe(
            tap((action:CustomerActions.UpdateCUstomerSuccess)=>{
                
            }
   
        ),
        switchMap((action:CustomerActions.UpdateCUstomerSuccess)=>
        [new CustomerActions.SelectCustomer(action.payload)]
        )
        );

  
        @Effect({dispatch:false})
        updateCustomerWithoutToastFail$: Observable<Action> = this.actions$
        .ofType(CustomerActions.UPDATE_CUSTOMER_NO_TOAST_FAIL)
        .pipe(
            tap((action:CustomerActions.UpdateCustomerFail)=>{
           
            }
        ));

       
}