import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from "rxjs";
import { Action } from '@ngrx/store/src/models';
import * as AllActions from './../actions';
import { switchMap } from 'rxjs/operators';
import { ServicePointPoolDataService } from "../services/service-point-pool/service-point-pool-data.service";
import { FetchServicePointInfo } from "./../actions";

const toAction = AllActions.toAction();
@Injectable()
export class ServicePointPoolEffects {
  constructor(
    private actions$: Actions,
    private ServicePointPoolDataService:ServicePointPoolDataService
  ) {}
  @Effect()
  getServicePointPools$: Observable<Action> = this.actions$
    .pipe(
      ofType(AllActions.FETCH_SERVICE_POINT_POOL_INFO),
      switchMap((action: FetchServicePointInfo) =>
        toAction(
          this.ServicePointPoolDataService.getServicePoints(action.payload),
          AllActions.FetchServicePointInfoSucess,
          AllActions.FetchServicePointInfoFail
        )
      )
    )
}