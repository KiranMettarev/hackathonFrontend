import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-offers',
  templateUrl: './bank-offers.component.html',
  styleUrl: './bank-offers.component.css'
})
export class BankOffersComponent {

  loadingFlag: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingFlag = false
    }, 5000);
  }
}
