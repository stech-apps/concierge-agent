import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'qm-qm-customer-create',
  templateUrl: './qm-customer-create.component.html',
  styleUrls: ['./qm-customer-create.component.scss']
})
export class QmCustomerCreateComponent implements OnInit {
    createCustomerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createCustomerForm = this.fb.group({ firstName:[], lastName:[],email:[],phone:[]})
  }

}
