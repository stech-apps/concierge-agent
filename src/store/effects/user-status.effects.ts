import { UserStatusDataService } from '../services';
import { GlobalErrorHandler } from '../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import * as UserStatusActions from '../actions';

const toAction = UserStatusActions.toAction();

@Injectable()
export class UserStatusEffects {
  constructor(
    private actions$: Actions,
    private userStatusDataService: UserStatusDataService,
    private errorHanlder: GlobalErrorHandler
  ) {}

  @Effect()
  getUserStatus$: Observable<Action> = this.actions$
    .ofType(UserStatusActions.FETCH_USER_STATUS)
    .pipe(
      switchMap(() =>
        toAction(
          this.userStatusDataService.getUserStatus(),
          UserStatusActions.FetchUserStatusSuccess,
          UserStatusActions.FetchUserStatusFail
        )
      )
    );
}
