import { Component, OnInit, Input, Output, EventEmitter,
  HostBinding, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { SystemInfoSelectors, UserSelectors } from 'src/store';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'qm-appointment-info',
  templateUrl: './qm-appointment-info.component.html',
  styleUrls: ['./qm-appointment-info.component.scss']
})
export class QmAppointmentInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  appointmentInfo: any = {};

  userDirection$: Observable<string>;

  @Output()
  onClose = new EventEmitter<boolean>();

  @Output()
  onCardClick = new EventEmitter<any>();

  @Input() public useCalendarEndpoint: boolean;

  @Input()
  @HostBinding('class.qm-appointment-info-host--wide-card')
  useWideCard: boolean  = false;

  subscriptions: Subscription = new Subscription();

  constructor(private elementRef: ElementRef, public userSelectors: UserSelectors) { }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngAfterViewInit() {
    let infoCardElement = this.elementRef.nativeElement;

    if (infoCardElement) {
      infoCardElement.scrollIntoView();
    }
  }

  onModalClick() {
    this.onClose.emit(true);
  }

  cardClick() {
    //this.onCardClick.emit(this.appointmentInfo);
    
  }
  
  onCustomerNameClick() {
    this.onCardClick.emit(this.appointmentInfo);
  }

  ngOnDestroy() {
  }
}
