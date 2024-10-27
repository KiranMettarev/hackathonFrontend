import { Component, EventEmitter, Output } from '@angular/core';
import { CallBackEvent } from '../../../models/user-details';

@Component({
  selector: 'app-bank-home',
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.css'
})
export class BankHomeComponent {

  @Output() step = new EventEmitter();

  showUploadType: boolean = false
   options:any = {};
   chart: any;
   data:any
   bankDetails: any
   aaDataFlag : boolean = false

   aaFetch(iFlag: boolean): void {
    console.log(iFlag, "aaFlag");
    if(iFlag){
      this.aaDataFlag = true
       console.log("true")
    } else {
       this.aaDataFlag = false
              console.log("false")

    }
    console.log(this.aaDataFlag, "aadataflag")
   }

   calculateData(){
    let totalCredit = 0;
    let totalDebit = 0;
    let totalBalance = 0;

const numberOfMonths = this.data.monthlySummary.length;

this.data.monthlySummary.forEach((month: any) => {
  totalCredit += month.totalCreditAmount;
  totalDebit += month.totalDebitAmount;
  totalBalance += month.averageMonthlyBalance;
});

const averageCredit = totalCredit / numberOfMonths;
const averageDebit = totalDebit / numberOfMonths;
const averageBalance = totalBalance / numberOfMonths;

const openingBalance = this.data.accountHolderDetails.openingBalance;
const closingBalance = this.data.accountHolderDetails.closingBalance; 

const financialSummary = {
  'Average Monthly Credit': averageCredit,
  'Average Monthly Debit': averageDebit,
  'Average Monthly Balance': averageBalance,
  'Opening Balance': openingBalance,
  'Closing Balance': closingBalance
};

this.bankDetails = Object.entries(financialSummary);

console.log(this.bankDetails, "bankDetails");
   }

   addAccount(): void {
    this.showUploadType = true;
  }

  analysisFlag: boolean = false

    callBackAA(ival: CallBackEvent): void {
       this.showUploadType = false;
       this.analysisFlag = true
  }

   next(iVal: number): void {
    this.step.emit(iVal)
  }
}

