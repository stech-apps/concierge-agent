import { QueueDataService } from './../services/queue/queue-data.service';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import * as QueueActions from './../actions';
import { FetchQueueInfo } from 'src/store';
import { FetchSelectedVisitInfo } from './../actions';
import { ToastService } from './../../util/services/toast.service';

const toAction = QueueActions.toAction();

@Injectable()
export class QueueEffects {
  constructor(
    private actions$: Actions,
    private queueDataService: QueueDataService,
    private translateService:TranslateService,
    private toastService:ToastService
  ) {}

  @Effect()
  getQueueSummary$: Observable<Action> = this.actions$
    .ofType(QueueActions.FETCH_QUEUE_INFO)
    .pipe(
      switchMap((fetchQueueRequest: FetchQueueInfo) =>
        toAction(
          this.queueDataService.getQueueInformation(fetchQueueRequest.payload),
          QueueActions.FetchQueueInfoSuccess,
          QueueActions.FetchQueueInfoFail
        )
      )
    );

  @Effect()
  getSelectedVisit$:Observable<Action> = this.actions$
  .ofType(QueueActions.FETCH_SELECTED_VISIT_INFO)
  .pipe(
    switchMap((fetchSelectedVisit:FetchSelectedVisitInfo)=>
    toAction(
      this.queueDataService.getSelectedVist(fetchSelectedVisit.branch,fetchSelectedVisit.searchText),
      QueueActions.FetchSelectedVisitInfoSuccess,
      QueueActions.FetchSelectedVisitInfoFail
    )),    
  )
}
