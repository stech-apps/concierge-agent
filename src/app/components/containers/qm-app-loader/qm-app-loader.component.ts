import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LicenseInfoSelectors } from 'src/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qm-app-loader',
  templateUrl: './qm-app-loader.component.html',
  styleUrls: ['./qm-app-loader.component.scss']
})
export class QmAppLoaderComponent implements OnInit {
  licenseSubscription: Subscription;
  
  constructor(private licenseSelector: LicenseInfoSelectors,
    private router: Router) { 
    this.licenseSubscription = this.licenseSelector.isLicenseLoaded$.subscribe(loadedState => {
      if (loadedState) {
        this.router.navigate(['/profile']);
      }
    });
  }

  ngOnInit() {
  }
}
