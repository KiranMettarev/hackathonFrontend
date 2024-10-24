import { Component } from '@angular/core';
import { CallBackEvent } from '../../models/user-details';
import { AadhaarDetails, AdharState, PanDetails, PanState } from '../../models/kyc';
import ApexCharts from "apexcharts";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  step: number = 4;
  showUploadType: boolean = false;
  aadharFlag: boolean = false
  panFlag: boolean = false
  billFlag: boolean = false

  addAccount(): void {
    this.showUploadType = true;
  }

  ngOnInit(){
     setTimeout(() => {
       this.initChartData()
   }, 1000);
  }

  fetchKYC(iVal: string): void {
    switch (iVal) {
      case 'aadhar':
        this.aadharFlag = true
        break;
      case 'pan':
        this.panFlag = true
        break;
      case 'bill':
        this.billFlag = true
        break;
    
      default:
        break;
    }
  }

  callBack(iVal: CallBackEvent): void {
    console.log(iVal, "ivalAdhar");
    
    this.aadharFlag = false
    this.panFlag = false
    this.billFlag = false
  }

  // callBackAA(ival: CallBackEvent): void {
  //   this.showUploadType = false
  // }

  selectedFileName: string = "";
  fileSelected: boolean = false;
  formData!: FormData;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      if (file.type === "application/pdf") {
        this.fileSelected = true;
        this.formData = new FormData();
        this.formData.append("file", file);
      } else {
        alert("Please select a PDF file.");
        this.fileSelected = false;
        this.resetFileInput();
      }
    }
  }

  removeFile(): void {
    this.fileSelected = false;
    this.selectedFileName = "";
    // this.isSubmitted = false;
    this.resetFileInput();
  }

  resetFileInput(): void {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

    stepVal(iVal: number): void {
      this.step = iVal
      console.log(this.step);
      
  }

  // aadhaarDataFlag: boolean = false
  // panDataFlag: boolean = false
  // adharDetails!: AadhaarDetails
  // panDetails!: PanDetails

  // aadhaarInfo(adhar: AadhaarDetails): void {
  //   this.adharDetails = adhar
  //   this.aadhaarDataFlag = true
  //   console.log(adhar, "workAdhar");
    
  // }

  // panInfo(pan: PanDetails): void {
  //    this.panDetails = pan
  //   this.panDataFlag = true
  //   console.log(pan, "workPan");
  // }

   options:any = {};
   chart: any;

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
      height: '400px',
      width: '350px',
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

}
