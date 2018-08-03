import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from '../../../../../node_modules/rxjs';
import { UserSelectors } from '../../../../store';
@Component({
  selector: 'qm-qm-customers',
  templateUrl: './qm-customers.component.html',
  styleUrls: ['./qm-customers.component.scss']
})
export class QmCustomersComponent implements OnInit {
  userDirection$ :Observable<string>;
  constructor( private router:Router,
    private userSelectors:UserSelectors) {
      this.userDirection$ = this.userSelectors.userDirection$;
   }

  ngOnInit() {
   
  };
  

  closeWidow(){
    this.router.navigate(['profile']);
  }


}
