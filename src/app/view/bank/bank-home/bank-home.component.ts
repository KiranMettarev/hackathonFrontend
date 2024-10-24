import { Component, EventEmitter, Output } from '@angular/core';
import { CallBackEvent } from '../../../models/user-details';
import ApexCharts from "apexcharts";

@Component({
  selector: 'app-bank-home',
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.css'
})
export class BankHomeComponent {

    @Output() step = new EventEmitter();


  showUploadType: boolean = true
   options:any = {};
   chart: any;
   data:any
   bankDetails: any
   bankCheks = ['Bank statement is authentic', 'Regular income confirmed', 'No negative balance observed', 'No inward bounces detected', 'No outward bounces detected']

   sampleData = {"id":"msg_015TcVU1PxXHzmBw2SM21Kzo","type":"message","role":"assistant","model":"claude-3-5-sonnet-20240620","content":[{"type":"text","text":"{\n  \"bankName\": \"Finvu Bank Ltd.\",\n  \"accountNumber\": \"XXXXX0254\",\n  \"salary\": {\n    \"lastSalary\": 30000,\n    \"averageSalaryInLast3Months\": 30000,\n    \"numberOfSalariesInLast6Months\": 6\n  },\n  \"emi\": {\n    \"totalEmifromLastMonth\": 2500,\n    \"numberOfEmiPaidInLastMonth\": 1,\n    \"averageMonthlyEmiInLast6Months\": 2500\n  },\n  \"accountHolderDetails\": {\n    \"period\": \"12 months\",\n    \"endDate\": \"2024-10-24\",\n    \"bankName\": \"Finvu Bank Ltd.\",\n    \"currency\": \"INR\",\n    \"accountNo\": \"XXXXX0254\",\n    \"startDate\": \"2023-10-24\",\n    \"clientName\": \"fName mName lName\",\n    \"accountType\": \"SAVINGS\",\n    \"closingBalance\": 86560,\n    \"openingBalance\": 0\n  },\n  \"monthlySummary\": [\n    {\n      \"month\": \"October 2024\",\n      \"totalDebitAmount\": 15000,\n      \"totalCreditAmount\": 30000,\n      \"averageMonthlyBalance\": 93960\n    },\n    {\n      \"month\": \"September 2024\",\n      \"totalDebitAmount\": 15150,\n      \"totalCreditAmount\": 30000,\n      \"averageMonthlyBalance\": 77635\n    },\n    {\n      \"month\": \"August 2024\",\n      \"totalDebitAmount\": 18730,\n      \"totalCreditAmount\": 30350,\n      \"averageMonthlyBalance\": 63940\n    },\n    {\n      \"month\": \"July 2024\",\n      \"totalDebitAmount\": 16300,\n      \"totalCreditAmount\": 30000,\n      \"averageMonthlyBalance\": 52590\n    },\n    {\n      \"month\": \"June 2024\",\n      \"totalDebitAmount\": 62330,\n      \"totalCreditAmount\": 30200,\n      \"averageMonthlyBalance\": 51395\n    },\n    {\n      \"month\": \"May 2024\",\n      \"totalDebitAmount\": 39300,\n      \"totalCreditAmount\": 30000,\n      \"averageMonthlyBalance\": 77870\n    },\n    {\n      \"month\": \"April 2024\",\n      \"totalDebitAmount\": 79180,\n      \"totalCreditAmount\": 30150,\n      \"averageMonthlyBalance\": 97585\n    },\n    {\n      \"month\": \"March 2024\",\n      \"totalDebitAmount\": 51800,\n      \"totalCreditAmount\": 30000,\n      \"averageMonthlyBalance\": 107585\n    },\n    {\n      \"month\": \"February 2024\",\n      \"totalDebitAmount\": 49650,\n      \"totalCreditAmount\": 60000,\n      \"averageMonthlyBalance\": 100250\n    },\n    {\n      \"month\": \"January 2024\",\n      \"totalDebitAmount\": 24900,\n      \"totalCreditAmount\": 30900,\n      \"averageMonthlyBalance\": 88100\n    },\n    {\n      \"month\": \"December 2023\",\n      \"totalDebitAmount\": 55720,\n      \"totalCreditAmount\": 39100,\n      \"averageMonthlyBalance\": 68210\n    },\n    {\n      \"month\": \"November 2023\",\n      \"totalDebitAmount\": 30040,\n      \"totalCreditAmount\": 30200,\n      \"averageMonthlyBalance\": 109690\n    }\n  ],\n  \"insights\": {\n    \"authenticityCheck\": true,\n    \"inwardBouncesCount\": 1,\n    \"regularIncomeCheck\": true,\n    \"outwardBouncesCount\": 0,\n    \"negativeBalanceCheck\": false\n  }\n}"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11834,"output_tokens":1002}}

   colconfig1: string[] = [
    "67px",
    "calc(100% - 196px)",
    "129px",
  ];

    colconfig2: string[] = [
    "67px",
    "calc(100% - 67px)",
  ];

  headerArr1: Header[] = [
    { title: "Rank", key: "rank" },
    { title: "Category", key: "category" },
    { title: "Amount", key: "amount" },
  ];

   headerArr2: Header[] = [
    { title: "status", key: "status" },
    { title: "Result", key: "result" },
  ];


   ngOnInit() {
    // setTimeout(() => {
       this.initChartData()
  //  }, 0);
  console.log(this.sampleData, "sampleData")
  this.data = JSON.parse(this.sampleData.content[0].text);
    console.log(this.data, "data")

    this.calculateData()

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
    console.log(this.showUploadType);
    
  }

    callBackAA(ival: CallBackEvent): void {
    this.showUploadType = false
  }

   initChartData(): void {
    console.error('Chart Load Call')
    this.options = {
      series: [{
        name: 'Total Debit',
        data: ['81578.5', '81862.14', '705768.97', '279885.39','78501.18', '144600.03', '0']
      },{
          name: 'Total Credit',
          data: ['81703.25', '130483', '949453', '1819','65811', '228708', '306']
      },{
        name: 'Average Monthly Balances',
        data: ['604.57', '49225.43', '292909.46', '14843.07','2152.89', '86260.86', '86566.86']
    }],
      chart: {
      height: '380px',
      width: '100%',
      // type: 'line',
      type: 'area',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection:false,
          pan:false,
          reset:false,
          zoom:false,
        }
      }
      },
      dataLabels: {
        enabled: false
      },
      
      stroke: {
        //  curve: 'straight',
        curve:'smooth',
        show:true,
        width: 2,
      },
      markers: {
        size: 4,
        colors: '#fff',
        strokeColors: ['#008ffb','#00e396','#feb019'],
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: "circle",
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
          size: undefined,
          sizeOffset: 2
        }
    },
      title: {
        text: '',
        align: 'left'
      },
      grid: {
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: false
            }
        },
        row: {
          opacity: 0.5
        },
      },
      legend: { show: true,position:'top',horizontalAlign:'right' },
      xaxis: {
        labels: {
          rotate: 0
        },
        categories: ["Oct 2022", "Nov 2022", "Dec 2022", "Jan 2023","Feb 2023", "Mar 2023", "Apr 2023"],  
      },
      tooltip: {
        // y: {
        //   formatter: (value:any) => { if(value != null || value != undefined){return value + '$' }}
        // },
      }
    };
        this.chart = new ApexCharts(document.querySelector("#chartnew"), this.options);
        this.chart.render();
  }

   next(iVal: number): void {
    this.step.emit(iVal)
  }
}

export type Header = {
  title: string,
  key: string
}
