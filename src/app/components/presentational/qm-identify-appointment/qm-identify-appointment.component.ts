import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  selector: 'qm-identify-appointment',
  templateUrl: './qm-identify-appointment.component.html',
  styleUrls: ['./qm-identify-appointment.component.scss'],

  animations: [
    trigger('slideInOut', [
      state('id', style({
        height: '42px',
      })),
      state('customer', style({
        height: '42px',
      })),
      state('duration', style({
        height: '350px',
      })),
      state('out', style({
        height: '0px',
        'padding-top': '0',
        'padding-bottom': '0'
      })),
      transition('out => customer', animate('500ms ease-in-out')),
      transition('customer => out', animate('500ms ease-in-out')),
      transition('id => out', animate('500ms ease-in-out')),
      transition('out => id', animate('500ms ease-in-out'))
    ])
  ]
  
})
export class QmIdentifyAppointmentComponent implements OnInit {

  selectedSearchIcon: string;
  searchPlaceHolderKey: string;
  showSearchInput: boolean;
  searchText: string;
  inputAnimationState: string;

  constructor() { }

  ngOnInit() {
    this.inputAnimationState = 'out';
  }

  toggleInputAnimationState(): void {
      this.inputAnimationState = this.inputAnimationState === 'out' ? this.selectedSearchIcon : 'out';
  }

  onSearchButtonClick(searchButton) {
    this.selectedSearchIcon = searchButton;
    this.searchText = ''
    if(searchButton == 'id') {
      this.searchPlaceHolderKey = 'please_enter_id_and_press_enter';  
      this.showSearchInput = true;    
    }
    else if(searchButton === 'customer'){
      this.searchPlaceHolderKey = 'please_enter_customer_attributes';
      this.showSearchInput = true;
    }
    else {
      this.showSearchInput = false;
      
    }
    this.toggleInputAnimationState();
  }
}
