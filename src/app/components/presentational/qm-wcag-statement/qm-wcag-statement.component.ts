import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'qm-qm-wcag-statement',
  templateUrl: './qm-wcag-statement.component.html',
  styleUrls: ['./qm-wcag-statement.component.scss']
})
export class QmWcagStatementComponent implements OnInit {

  constructor(private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  backToHome(){
    this.router.navigate(['home']);
  }
  redirectToStatement(){
    this.router.navigate(['accessibility']);
  }

}
