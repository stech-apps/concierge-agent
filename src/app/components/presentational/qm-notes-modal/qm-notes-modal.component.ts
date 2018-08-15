import { AutoClose } from "./../../../../util/services/autoclose.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable,Subscription } from "rxjs";
import { UserSelectors } from "./../../../../store/services/user/user.selectors";
import { NoteSelectors, NoteDispatchers } from "../../../../store";
import { INote } from "../../../../models/INote";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'qm-notes-modal',
  templateUrl: './qm-notes-modal.component.html',
  styleUrls: ['./qm-notes-modal.component.scss']
})
export class QmNotesModalComponent implements OnInit,OnDestroy{

  private subscriptions: Subscription = new Subscription();

  text: string;
  themeColor:string;
  btnOkText: string;
  btnCancelText: string;
  userDirection$: Observable<string>;
  noteForm: FormGroup;
  charCount:number = 1000;

  constructor(
    private activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors,
    private noteSelectors: NoteSelectors,
    private noteDispatchers: NoteDispatchers

  ) { }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.noteForm = new FormGroup({
      note: new FormControl(this.text)

    })

    this.charCount = 1000 -  this.noteForm.get('note').value.length;

    const noteSubscription = this.noteForm.get('note').valueChanges.subscribe(() => {
      if (this.noteForm.controls['note'].dirty) {
        this.charCount = 1000 -  this.noteForm.get('note').value.length;
        if(this.noteForm.controls['note'].value === ''){
   
        }
      }
    });
    this.subscriptions.add(noteSubscription);

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if(this.noteForm.controls['note'].value === ''){

      return;
    }
    this.text = this.noteForm.controls['note'].value;
  
    this.noteDispatchers.saveNote(
      {
        text: this.text
      }
    );
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
