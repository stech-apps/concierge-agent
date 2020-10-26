import { QueueVisitsDataService } from '../services/queue-visits/queue-visits-data.service';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import * as QueueVisitsActions from '../actions';
import { FetchQueueVisits } from 'src/store';

const toAction = QueueVisitsActions.toAction();

@Injectable()
export class QueueVisitsEffects {
  constructor(
    private actions$: Actions,
    private queueVisitsDataService: QueueVisitsDataService
  ) {}

  @Effect()
  getQueueVisists$: Observable<Action> = this.actions$
    .pipe(
      ofType(QueueVisitsActions.FETCH_QUEUE_VISITS),
      switchMap((fetchQueueVisitsRequest: FetchQueueVisits) =>
        toAction(
          this.queueVisitsDataService.getQueueVisitInformation(fetchQueueVisitsRequest.branchId,fetchQueueVisitsRequest.queueId),
          QueueVisitsActions.FetchQueueVisitsSuccess,
          QueueVisitsActions.FetchQueueVisitsFail
        )
      )
    );
}
