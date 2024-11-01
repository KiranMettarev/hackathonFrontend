import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-home',
  templateUrl: './quotation-home.component.html',
  styleUrl: './quotation-home.component.css'
})
export class QuotationHomeComponent {
  constructor( private router: Router,) {}

  fileFlag: boolean = false
  validationFlag: boolean = false

  checkObj =
    {
      'Mob. No': 9421954165,
      'Acct. No': 60050220088
    }
    dataEntries!: any
  

  ngOnInit(){
     this.dataEntries = Object.entries(this.checkObj);
  }

  redirect(): void {
      this.router.navigate(['user/offers']);
  }

  fileUpload(iFlag: boolean): void {
      this.fileFlag = iFlag
  }
}
