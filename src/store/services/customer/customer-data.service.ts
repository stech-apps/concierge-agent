import { Injectable } from "../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { GlobalErrorHandler } from "../../../util/services/global-error-handler.service";
import { Observable } from "../../../../node_modules/rxjs";
import { catchError } from "../../../../node_modules/rxjs/operators";
import { ICustomer } from "../../../models/ICustomer";
import { servicePoint, restEndpoint } from '../data.service';

@Injectable()
export class CustomerDataService{
    constructor(private http:HttpClient, private errorHandler:GlobalErrorHandler){}

    getCustomers(searchText:string):Observable<ICustomer[]>{
         return this.http
        .get<ICustomer[]>(`${servicePoint}/customers/search?text=${encodeURIComponent(searchText)}`)        
        .pipe(catchError(this.errorHandler.handleError()));
    }

    getAppointmentCustomers(searchText:string):Observable<ICustomer[]>{
        return this.http
       .get<ICustomer[]>(`${restEndpoint}/appointment/customers/search?text=${encodeURIComponent(searchText)}`)        
       .pipe(catchError(this.errorHandler.handleError()));
   }

    createCustomer(customer:ICustomer):Observable<ICustomer>{
        return this.http
        .post<ICustomer>(`${servicePoint}/customers`,customer)
        .pipe(
            catchError(this.errorHandler.handleError())
        );
    }

    updateCustomer(customer : ICustomer):Observable<ICustomer>{
        return this.http
        .put<ICustomer>(`${servicePoint}/customers/${customer.id}`,customer)
        .pipe(
            catchError(this.errorHandler.handleError())
        );
    }

}