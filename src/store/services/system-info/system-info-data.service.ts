

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { calendarEndpoint,restEndpoint, servicePoint , DataServiceError } from '../data.service';

import { ISystemInfo } from '../../../models/ISystemInfo';
import { Observable, throwError } from 'rxjs';


@Injectable()
export class SystemInfoDataService {
  constructor(private http: HttpClient) {}

  getSystemInfo(): Observable<ISystemInfo> {
    return this.http
      .get<ISystemInfo>(`${restEndpoint}/managementinformation/systemInformation`)
      .pipe();
  }

  getServicePointSystemInfo(): Observable<ISystemInfo> {
    return this.http
    .get<ISystemInfo>(`${servicePoint}/systemInformation`)
    .pipe();
  }
}
