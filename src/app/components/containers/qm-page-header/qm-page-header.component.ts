import { QmSideMenuComponent } from './../qm-side-menu/qm-side-menu.component';
import { Component, OnInit, ElementRef, ContentChild, AfterContentInit, ViewChild } from '@angular/core';



@Component({
  selector: 'qm-page-header',
  templateUrl: './qm-page-header.component.html',
  styleUrls: ['./qm-page-header.component.scss']
})
export class QmPageHeaderComponent implements OnInit, AfterContentInit {

  @ViewChild(QmSideMenuComponent) sideMenu: QmSideMenuComponent;
  
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {

  }

  toggleClassMenu() {
    this.sideMenu.toggleMenu();
  }
}
