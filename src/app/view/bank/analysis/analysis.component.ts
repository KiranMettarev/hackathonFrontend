import { Component, EventEmitter, Output } from '@angular/core';
import ApexCharts from 'apexcharts';
import { DocAPIService } from '../../../services/doc-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css',
})
export class AnalysisComponent {
  @Output() step = new EventEmitter();
  private destroy$ = new Subject<void>();
  options: any = {};
  chart: any;

  data: any;
  bankDetails: any;
  aaDataFlag: boolean = true;
  dataReceivedFlag: boolean = false;

  monthsArr!: string[];
  totalDebitArr!: number[];
  totalCreditArr!: number[];
  averageMonthlyBalancesArr!: number[];

  bankCheks = [
    'Bank statement is authentic',
    'Regular income confirmed',
    'No negative balance observed',
    'No inward bounces detected',
    'No outward bounces detected',
  ];

  colconfig1: string[] = [
    // "50px",
    'calc(100% - 150px)',
    '150px',
  ];

  colconfig2: string[] = ['67px', 'calc(100% - 67px)'];

  headerArr1: Header[] = [
    // { title: "Rank", key: "rank" },
    { title: 'Category', key: 'category' },
    { title: 'Amount in ₹', key: 'amount' },
  ];

  headerArr2: Header[] = [
    { title: 'Status', key: 'status' },
    { title: 'Result', key: 'result' },
  ];

  constructor(private docAPIService: DocAPIService) {}

  ngOnInit(): void {
      for (let i = 0; i < 3; i++) {
     if(!this.dataReceivedFlag){
       setTimeout(() => this.ConsentStatus(), i * 5000);
     }
    }

    //  console.log(this.sampleData, "sampleData")
    //  ---------------------------------------
    // this.data = JSON.parse(this.sampleData.content[0].text);
    // // this.data = JSON.parse(this.sampleData2.data);
    // console.log(this.data, 'data');

    // if (this.data.monthlySummary.length > 0) {
    //   this.dataReceivedFlag = true;
    //   this.calculateData();
    //   this.calculateArrValues();

    //   setTimeout(() => {
    //     this.initChartData();
    //   }, 1000);
    // } else {
    //   console.log('Error');
    // }
    // ------------------------
  }

  ConsentStatus(): void {
    this.docAPIService
      .checkConsent()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log(data, 'Consent - data from Finvu');
          // this.data = JSON.parse(this.sampleData.content[0].text);
          this.data = JSON.parse(data.content[0].text);
          console.log(this.data, "data")

          if (this.data.monthlySummary.length > 0) {
            this.dataReceivedFlag = true;
            this.calculateData();
            this.calculateArrValues();

            setTimeout(() => {
              this.initChartData();
            }, 1000);
          } else {
            console.log('Error');
          }
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          // this.aaFetchFlag.emit(false)
        },
      });
  }

  calculateData() {
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
      'Closing Balance': closingBalance,
    };

    this.bankDetails = Object.entries(financialSummary);
    console.log(this.bankDetails, "bankDetails")
  }

  calculateArrValues(): void {
    const months = this.data.monthlySummary.map(
      (item: { month: { split: (arg0: string) => [any, any] } }) => {
        const [fullMonth, year] = item.month.split(' ');
        const monthAbbreviation = fullMonth.slice(0, 3);
        return `${monthAbbreviation} ${year}`;
      }
    );

    const totalDebitAmounts = this.data.monthlySummary.map(
      (item: { totalDebitAmount: any }) => item.totalDebitAmount
    );
    const totalCreditAmounts = this.data.monthlySummary.map(
      (item: { totalCreditAmount: any }) => item.totalCreditAmount
    );
    const averageMonthlyBalances = this.data.monthlySummary.map(
      (item: { averageMonthlyBalance: any }) => item.averageMonthlyBalance
    );
    this.monthsArr = months;
    this.totalDebitArr = totalDebitAmounts;
    this.totalCreditArr = totalCreditAmounts;
    this.averageMonthlyBalancesArr = averageMonthlyBalances;
  }

  initChartData(): void {
    console.error('Chart Load Call');
    this.options = {
      series: [
        {
          name: 'Total Debit',
          // data: ['81578.5', '81862.14', '705768.97', '279885.39','78501.18', '144600.03', '0']
          data: this.totalDebitArr.slice().reverse(),
        },
        {
          name: 'Total Credit',
          // data: ['81703.25', '130483', '949453', '1819','65811', '228708', '306']
          data: this.totalCreditArr.slice().reverse(),
        },
        {
          name: 'Average Monthly Balances',
          // data: ['604.57', '49225.43', '292909.46', '14843.07','2152.89', '86260.86', '86566.86']
          data: this.averageMonthlyBalancesArr.slice().reverse(),
        },
      ],
      chart: {
        height: '380px',
        width: '100%',
        // type: 'line',
        type: 'area',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            pan: false,
            reset: false,
            zoom: false,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        //  curve: 'straight',
        curve: 'smooth',
        show: true,
        width: 2,
      },
      markers: {
        size: 4,
        colors: '#fff',
        strokeColors: ['#008ffb', '#00e396', '#feb019'],
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: 'circle',
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
      },
      title: {
        text: '',
        align: 'left',
      },
      grid: {
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false,
          },
        },
        row: {
          opacity: 0.5,
        },
      },
      legend: { show: true, position: 'top', horizontalAlign: 'right' },
      xaxis: {
        labels: {
          rotate: -45,
        },
        // categories: ["Oct 2022", "Nov 2022", "Dec 2022", "Jan 2023","Feb 2023", "Mar 2023", "Apr 2023"],
        categories: this.monthsArr.slice().reverse(),
      },
      tooltip: {
        // y: {
        //   formatter: (value:any) => { if(value != null || value != undefined){return value + '$' }}
        // },
      },
    };
    this.chart = new ApexCharts(
      document.querySelector('#chartnew'),
      this.options
    );
    this.chart.render();
  }

  next(iVal: number): void {
    this.step.emit(iVal);
  }
}

export type Header = {
  title: string;
  key: string;
};
