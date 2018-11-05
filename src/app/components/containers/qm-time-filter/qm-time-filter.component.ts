import { Component, OnInit, Input } from "@angular/core";
import { UserSelectors } from "src/store";
import { Observable } from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: "qm-qm-time-filter",
  templateUrl: "./qm-time-filter.component.html",
  styleUrls: ["./qm-time-filter.component.scss"]
})
export class QmTimeFilterComponent implements OnInit {
  constructor(
    private userSelectors: UserSelectors,
    public activeModal: NgbActiveModal
  ) {}

  public header: string;
  public subheader: string;
  userDirection$: Observable<string> = new Observable<string>();
  validationFailed: boolean;
  selectedStartTime: moment.Moment;
  selectedEndTime: moment.Moment;

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  onApplyClick() {
    this.activeModal.close({
      start: this.selectedStartTime,
      end: this.selectedEndTime
    });
  }

  onTimeStartSelect(startTime: moment.Moment) {
    this.selectedStartTime = startTime;
    this.checkValidation();
  }

  private checkValidation() {
    if (!this.selectedStartTime || !this.selectedEndTime) {
      return;
    }

    if (
      this.selectedStartTime.isAfter(this.selectedEndTime) ||
      this.selectedStartTime.isSame(this.selectedEndTime)
    ) {
      this.validationFailed = true;
    } else {
      this.validationFailed = false;
    }
  }

  onTimeEndSelect(endTime: moment.Moment) {
    this.selectedEndTime = endTime;
    this.checkValidation();
  }
}
