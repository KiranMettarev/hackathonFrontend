import { Component, EventEmitter, Output } from '@angular/core';
import { CallBackEvent } from '../../../models/user-details';
import ApexCharts from "apexcharts";
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-home',
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.css'
})
export class BankHomeComponent {

  @Output() step = new EventEmitter();
  @Output() abc = new EventEmitter();

  showUploadType: boolean = false
   options:any = {};
   chart: any;
   data:any
   bankDetails: any
   aaDataFlag : boolean = false

 
  constructor(
    private router: Router,
  ) {}

   ngOnInit() {}

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

   step2(iVal: number): void {
    this.abc.emit(iVal)
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
    // console.log(this.showUploadType);
    
  }

  analysisFlag: boolean = false

    callBackAA(ival: CallBackEvent): void {
      console.log(ival, "kkkkkkkkkkkkkk");
      // this.router.navigate(['user/analysis']);
       this.showUploadType = false;
   this.analysisFlag = true
  }

  //  initChartData(): void {
  //   console.error('Chart Load Call')
  //   this.options = {
  //     series: [{
  //       name: 'Total Debit',
  //       data: ['81578.5', '81862.14', '705768.97', '279885.39','78501.18', '144600.03', '0']
  //     },{
  //         name: 'Total Credit',
  //         data: ['81703.25', '130483', '949453', '1819','65811', '228708', '306']
  //     },{
  //       name: 'Average Monthly Balances',
  //       data: ['604.57', '49225.43', '292909.46', '14843.07','2152.89', '86260.86', '86566.86']
  //   }],
  //     chart: {
  //     height: '380px',
  //     width: '100%',
  //     // type: 'line',
  //     type: 'area',
  //     zoom: {
  //       enabled: false
  //     },
  //     toolbar: {
  //       show: true,
  //       tools: {
  //         download: false,
  //         selection:false,
  //         pan:false,
  //         reset:false,
  //         zoom:false,
  //       }
  //     }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
      
  //     stroke: {
  //       //  curve: 'straight',
  //       curve:'smooth',
  //       show:true,
  //       width: 2,
  //     },
  //     markers: {
  //       size: 4,
  //       colors: '#fff',
  //       strokeColors: ['#008ffb','#00e396','#feb019'],
  //       strokeWidth: 2,
  //       strokeOpacity: 0.9,
  //       strokeDashArray: 0,
  //       fillOpacity: 1,
  //       discrete: [],
  //       shape: "circle",
  //       offsetX: 0,
  //       offsetY: 0,
  //       onClick: undefined,
  //       onDblClick: undefined,
  //       showNullDataPoints: true,
  //       hover: {
  //         size: undefined,
  //         sizeOffset: 2
  //       }
  //   },
  //     title: {
  //       text: '',
  //       align: 'left'
  //     },
  //     grid: {
  //       strokeDashArray: 4,
  //       xaxis: {
  //           lines: {
  //               show: false
  //           }
  //       },
  //       row: {
  //         opacity: 0.5
  //       },
  //     },
  //     legend: { show: true,position:'top',horizontalAlign:'right' },
  //     xaxis: {
  //       labels: {
  //         rotate: 0
  //       },
  //       categories: ["Oct 2022", "Nov 2022", "Dec 2022", "Jan 2023","Feb 2023", "Mar 2023", "Apr 2023"],  
  //     },
  //     tooltip: {
  //       // y: {
  //       //   formatter: (value:any) => { if(value != null || value != undefined){return value + '$' }}
  //       // },
  //     }
  //   };
  //       this.chart = new ApexCharts(document.querySelector("#chartnew"), this.options);
  //       this.chart.render();
  // }

  //  next(iVal: number): void {
  //   this.step.emit(iVal)
  // }
}

// export type Header = {
//   title: string,
//   key: string
// }
