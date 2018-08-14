import { Action } from '@ngrx/store';
import { ICustomer } from '../../models/ICustomer';


//customer actions

export const UPDATE_CUSTOMER_SEARCH_TEXT = '[Customer] UPDATE_CUSTOMER_SEARCH_TEXT';
export const RESET_CUSTOMER_SEARCH_TEXT = '[Customer] RESET_CUSTOMER_SEARCH_TEXT';
export const SELECT_CUSTOMER = '[Customer] SELECT_CUSTOMER';
export const RESET_CURRENT_CUSTOMER = '[Customer] RESET_CURRENT_CUSTOMER';
export const FETCH_CUSTOMERS= '[Customer] FETCH_CUSTOMERS';
export const FETCH_CUSTOMERS_FAIL= '[Customer] FETCH_CUSTOMERS_FAIL';
export const FETCH_CUSTOMERS_SUCCESS= '[Customer] FETCH_CUSTOMERS_SUCCESS';
export const RESET_CUSTOMERS= '[Customer] RESET_CUSTOMERS';
export const CREATE_CUSTOMER= '[Customer] CREATE_CUSTOMER';
export const CREATE_CUSTOMER_FAIL= '[Customer] CREATE_CUSTOMER_FAIL';
export const CREATE_CUSTOMER_SUCCESS= '[Customer] CREATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER= '[Customer] UPDATE_CUSTOMER';
export const UPDATE_CUSTOMER_FAIL= '[Customer] UPDATE_CUSTOMER_FAIL';
export const UPDATE_CUSTOMER_SUCCESS= '[Customer] UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_NO_TOAST= '[Customer] UPDATE_CUSTOMER_NO_TOAST';
export const UPDATE_CUSTOMER_NO_TOAST_FAIL= '[Customer] UPDATE_CUSTOMER_NO_TOAST_FAIL';
export const UPDATE_CUSTOMER_NO_TOAST_SUCCESS= '[Customer] UPDATE_CUSTOMER_NO_TOAST_SUCCESS';
export const SET_TEMP_CUSTOMER = '[Customer] SET_TEMP_CUSTOMER';
export const RESET_TEMP_CUSTOMER = '[Customer] RESET_TEMP_CUSTOMER';

export class UpdateCustomerSearchText implements Action{
    readonly type = UPDATE_CUSTOMER_SEARCH_TEXT;
    constructor(public payload:string){}
}

export class ResetCustomerSearchText implements Action{
    readonly type = RESET_CUSTOMER_SEARCH_TEXT;
}

export class SelectCustomer implements Action{
    readonly type = SELECT_CUSTOMER;
    constructor(public payload: ICustomer) {}

}

export class ResetCurrentCustomer implements Action{
    readonly type = RESET_CURRENT_CUSTOMER
}

export class FetchCustomers implements Action{
    readonly type = FETCH_CUSTOMERS;
    constructor(public payload:string){}
}

export class FetchCustomersFail implements Action{
    readonly type = FETCH_CUSTOMERS_FAIL;
    constructor(public payload:Object){}
}

export class FetchCustomersSuccess implements Action{
    readonly type = FETCH_CUSTOMERS_SUCCESS;
    constructor (public payload:ICustomer[]){}
}

export class ResetCustomers implements Action{
    readonly type= RESET_CUSTOMERS;
}

export class CreateCustomer implements Action{
    readonly type = CREATE_CUSTOMER;
    constructor (public payload:ICustomer){}
}
export class CreateCustomerFail implements Action{
    readonly type = CREATE_CUSTOMER_FAIL;
    constructor (public payload:object){}
}
export class CreateCustomerSuccess implements Action{
    readonly type = CREATE_CUSTOMER_SUCCESS;
    constructor(public payload:ICustomer){}
}
export class UpdateCustomer implements Action{
    readonly type = UPDATE_CUSTOMER;
    constructor (public payload:ICustomer){}
}
export class  UpdateCustomerFail implements Action{
    readonly type = UPDATE_CUSTOMER_FAIL;
    constructor (public payload:object){}
}
export class UpdateCUstomerSuccess implements Action{
    readonly type = UPDATE_CUSTOMER_SUCCESS;
    constructor (public payload:ICustomer){}
}

export class UpdateCustomerWithoutToast implements Action{
    readonly type = UPDATE_CUSTOMER_NO_TOAST;
    constructor (public payload:ICustomer){}
}

export class  UpdateCustomerWithoutToastFail implements Action{
    readonly type = UPDATE_CUSTOMER_NO_TOAST_FAIL;
    constructor (public payload:object){}
}
export class UpdateCustomerWithoutToastSuccess implements Action{
    readonly type = UPDATE_CUSTOMER_NO_TOAST_SUCCESS;
    constructor (public payload:ICustomer){}
}

export class SetTempCustomer implements Action{
    readonly type = SET_TEMP_CUSTOMER;
    constructor(public payload: ICustomer) {}
}

export class ResetTempCustomer implements Action{
    readonly type = RESET_TEMP_CUSTOMER;
}


export type AllCustomerActions = UpdateCustomerSearchText | ResetCustomerSearchText |SelectCustomer |ResetCurrentCustomer
            |FetchCustomers|FetchCustomersFail|FetchCustomersSuccess | ResetCustomers| CreateCustomer | CreateCustomerFail | CreateCustomerSuccess
            |UpdateCustomer|UpdateCustomerFail|UpdateCUstomerSuccess|UpdateCustomerWithoutToast|UpdateCustomerWithoutToastFail|UpdateCustomerWithoutToastSuccess
            | SetTempCustomer | ResetTempCustomer;
