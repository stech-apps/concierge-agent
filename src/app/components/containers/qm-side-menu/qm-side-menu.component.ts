import { Component, OnInit, Output, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'qm-side-menu',
  templateUrl: './qm-side-menu.component.html',
  styleUrls: ['./qm-side-menu.component.scss']
})
export class QmSideMenuComponent implements OnInit {

  @ViewChild('menu') menu: ElementRef;

  constructor() { }

  toggleMenu() {
    this.menu.nativeElement.classList.add("qm-side-menu__container--animatable");	
    if(!this.menu.nativeElement.classList.contains("qm-side-menu__container--visible")) {		
      this.menu.nativeElement.classList.add("qm-side-menu__container--visible");
    } else {
      this.menu.nativeElement.classList.remove('qm-side-menu__container--visible');		
    }	
  }

  ngOnInit() {
  }

}
