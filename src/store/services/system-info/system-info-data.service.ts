

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { restEndpoint, centralRestEndPoint } from '../data.service';

import { ISystemInfo } from '../../../models/ISystemInfo';
import { Observable } from 'rxjs';


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
    .get<ISystemInfo>(`${centralRestEndPoint}/servicepoint/systemInformation`)
    .pipe();
  }
}
