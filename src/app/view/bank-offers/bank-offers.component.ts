import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-offers',
  templateUrl: './bank-offers.component.html',
  styleUrl: './bank-offers.component.css',
})
export class BankOffersComponent {
  loadingFlag: boolean = true;
  endFlag: boolean = false;
  selectedBankName: string = '';
  bankofferArr: any = [
    {
      TITLE: 'Janata Sahakari Bank',
      img: '/assets/icons/jananta.png',
      desc: 'Amount up to ₹ 1,00,000, Interest: 9.50%, Tenure: up to 84 months.',
    },
    {
      TITLE: 'Suryoday Small Finance Bank',
      img: '/assets/icons/SuryodayBank.png',
      desc: 'Amount: up to 90% of the on-road price, Interest: 11%, Tenure: up to 48 months.',
    },
    {
      TITLE: 'IDFC First Bank',
      img: '/assets/icons/IDFC.jpg',
      desc: 'Amount up to ₹ 1,00,000, Interest: 9% to 26%, Tenure: up to 48 months.',
    },
    {
      TITLE: 'Bank of Maharashtra',
      img: '/assets/icons/Bom.png',
      desc: 'Amount up to ₹ 1,00,000, Interest: 8.5% to 11%, Tenure: up to 60 months.',
    },
    {
      TITLE: 'L&T Finance',
      img: '/assets/icons/LTFinance.webp',
      desc: 'Amount up to 100% of the on-road price, Interest: starting from 9.5%, Tenure: up to 48 months.',
    },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingFlag = false;
    }, 5000);
  }
  selectBank(iObj: any) {
    this.selectedBankName = iObj.TITLE;
    this.endFlag = true;
  }
}
