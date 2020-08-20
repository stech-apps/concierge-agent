import { HttpErrorResponse } from '@angular/common/http';

export const servicePoint = '/rest/servicepoint';
export const restEndpoint = '/rest';
export const centralRestEndPoint = '/qsystem/rest';
export const calendarEndpoint = '/calendar-backend/api/v1';
export const calendarPublicEndpoint = '/calendar-backend/public/api/v1';
export const calendarPublicEndpointV2 = '/calendar-backend/public/api/v2';
export const managementEndpoint = '/rest/managementinformation/v2';
export const qsystemEndpoint = '/qsystem/rest';
export const appointmentEndPoint = '/rest/appointment';
export const applicationId = 'connectconcierge';

export const ERROR_CODE = 'error_code';
export const ERROR_MESSAGE = 'error_message';

export class DataServiceError<T> {
  public errorCode: string = '0';
  public errorMsg: string = '';

  constructor(public responseData: any, public requestData?: T) {
    this.parseErrors(responseData);
  }

  private parseErrors(responseData: HttpErrorResponse) {
    if (responseData && responseData.headers) {
      this.errorCode = responseData.headers.get(ERROR_CODE) || '0';
      this.errorMsg = responseData.headers.get(ERROR_MESSAGE) || '';
    }
  }

  toString() {
    return `${this.errorCode} : ${this.errorMsg}`;
  }
}
