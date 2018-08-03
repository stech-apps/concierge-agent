import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'qm-qm-customers',
  templateUrl: './qm-customers.component.html',
  styleUrls: ['./qm-customers.component.scss']
})
export class QmCustomersComponent implements OnInit {
  constructor( private router:Router) {
   }

  ngOnInit() {
   
  };
  

  closeWidow(){
    this.router.navigate(['profile']);
  }


}
