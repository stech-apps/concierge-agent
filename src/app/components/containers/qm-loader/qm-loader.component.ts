import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qm-loader',
  templateUrl: './qm-loader.component.html',
  styleUrls: ['./qm-loader.component.scss']
})
export class QmLoaderComponent implements OnInit {
  
  @Input() color:string;
  fontColor :string;
  

  constructor() { 
    
  }

  ngOnInit() {
  
  }
  clickedbutton(){
    console.log(this.color);
  }

}
