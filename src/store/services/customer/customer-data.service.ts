import { Injectable } from "../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { GlobalErrorHandler } from "../../../util/services/global-error-handler.service";
import { Observable } from "../../../../node_modules/rxjs";
import {calendarEndpoint} from '../data.service'
import { catchError } from "../../../../node_modules/rxjs/operators";
import { ICustomer } from "../../../models/ICustomer";
import { ICustomerResponse } from "../../../models/ICustomerResponse";

@Injectable()
export class CustomerDataService{
    constructor(private http:HttpClient, private errorHandler:GlobalErrorHandler){}

    getCustomers(searchText:string):Observable<ICustomerResponse>{
        if(searchText.indexOf('+')>-1){
            searchText = encodeURIComponent(searchText);
        }
        return this.http
        .get<ICustomerResponse>(`${calendarEndpoint}/customers/searchcustomer?text=${searchText}`)        
        .pipe(catchError(this.errorHandler.handleError()));
    }

    createCustomer(customers:ICustomer):Observable<ICustomer>{
        return this.http
        .post<ICustomer>(`${calendarEndpoint}/customers`,customers)
        .pipe(
            catchError(this.errorHandler.handleError())
        );
    }

    updateCustomer(customer : ICustomer):Observable<ICustomer>{
        return this.http
        .put<ICustomer>(`${calendarEndpoint}/customers/${customer.id}`,customer)
        .pipe(
            catchError(this.errorHandler.handleError())
        );
    }

}