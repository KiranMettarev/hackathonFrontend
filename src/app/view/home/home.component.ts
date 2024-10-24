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

  step: number = 1;
  showUploadType: boolean = false;
  aadharFlag: boolean = false
  panFlag: boolean = false
  billFlag: boolean = false

  addAccount(): void {
    this.showUploadType = true;
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

}
