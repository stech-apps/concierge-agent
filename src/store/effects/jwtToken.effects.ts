import { JWTTokenDataService } from './../services';
import { GlobalErrorHandler } from './../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import * as JWTTokenActions from './../actions';

const toAction = JWTTokenActions.toAction();

@Injectable()
export class JWTTokenEffects {
  constructor(
    private actions$: Actions,
    private jwtTokenDataService: JWTTokenDataService,
    private errorHanlder: GlobalErrorHandler
  ) {}

  @Effect()
  getJWTToken$: Observable<Action> = this.actions$
      .pipe(
        ofType(JWTTokenActions.FETCH_JWT_TOKEN),
        switchMap(() =>
          toAction(
            this.jwtTokenDataService.getJWTToken(),
            JWTTokenActions.FetchJWTTokenSuccess,
            JWTTokenActions.FetchJWTTokenFail
          )
        )
      );
}
