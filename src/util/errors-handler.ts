// errors-handler.ts
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './services/toast.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import * as moment from 'moment';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

  constructor(private injector: Injector) {

  }

  handleError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened and should handle in global handler
      this.injector.get(GlobalErrorHandler).handleError();
      throw error;
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)  
      console.log(moment().format('YYYY-MM-DD HH:mm')+" INFO "+'Unhandled Client Error happened');
      // Log the error 
      console.error(moment().format('YYYY-MM-DD HH:mm') +" ERROR "+error);
    }
  }
}