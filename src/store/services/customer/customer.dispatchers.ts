import { Injectable } from "@angular/core";
import { IAppState } from "../../reducers";
import { Store} from "@ngrx/store"
import * as CustomerAction from '../../actions'
import {ICustomer} from "../../../models/ICustomer"

@Injectable()
export class CustomerDispatchers{
    constructor(private store: Store<IAppState>){}

    fetchCustomers(searchText:string){
        this.store.dispatch(new CustomerAction.FetchCustomers(searchText));
    }

    resetCustomers(){
        this.store.dispatch(new CustomerAction.ResetCustomers);
    }

    selectCustomers(customer:ICustomer){
        this.store.dispatch(new CustomerAction.SelectCustomer(customer));
    }
 
    createCustomer(customer:ICustomer){
        this.store.dispatch(new CustomerAction.CreateCustomer(customer));
    }

    updateCustomer(customer:ICustomer){
        this.store.dispatch(new CustomerAction.UpdateCustomer(customer));
    }

    resetCurrentCustomer(){
        this.store.dispatch(new CustomerAction.ResetCurrentCustomer);
    
    }

    updateCustomerSearchText(searchText:string){
        this.store.dispatch(new CustomerAction.UpdateCustomerSearchText(searchText));
    }

    resetCustomerSearchText(){
        this.store.dispatch(new CustomerAction.ResetCustomerSearchText);
    }

    updateCustomerWithoutToast(customer:ICustomer){
        this.store.dispatch(new CustomerAction.UpdateCustomerWithoutToast(customer));
    }


}

