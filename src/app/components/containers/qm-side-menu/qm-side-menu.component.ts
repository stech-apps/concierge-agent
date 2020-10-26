import { UserSelectors } from 'src/store/services';
import { Component, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qm-side-menu',
  templateUrl: './qm-side-menu.component.html',
  styleUrls: ['./qm-side-menu.component.scss']
})
export class QmSideMenuComponent implements OnInit {

  @ViewChild('menu', { static: true }) menu: ElementRef;

  subscriptions: Subscription = new Subscription();
  currentUser: string;

  //todo: bind from store
  connectedDevice: string = 'MobileConnectConcierge_TPTouch'.toUpperCase();

  constructor(private userSelectors: UserSelectors) { }

  toggleMenu() {
    this.menu.nativeElement.classList.add("qm-side-menu__container--animatable");	
    if(!this.menu.nativeElement.classList.contains("qm-side-menu__container--visible")) {		
      this.menu.nativeElement.classList.add("qm-side-menu__container--visible");
    } else {
      this.menu.nativeElement.classList.remove('qm-side-menu__container--visible');		
    }	
  }

  ngOnInit() {
   const userSubscription  = this.userSelectors.userFullName$.subscribe((u)=> {
      this.currentUser = u.toUpperCase();
    });

    this.subscriptions.add(userSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
