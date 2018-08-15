import { Injectable } from '@angular/core';
import { Store,createSelector,createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { INoteState } from './../../reducers/note.reducer';

// selectors

const getNoteState = createFeatureSelector<INoteState>(
  'note'
);


const getNote = createSelector(
  getNoteState,
  (state: INoteState) => state.text
);



@Injectable()
export class NoteSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
 
  getNote$ = this.store.select(getNote);
}
