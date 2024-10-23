import { Component } from '@angular/core';
import { CallBackEvent } from '../../models/user-details';

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

  callBack(ival: CallBackEvent): void {
    this.aadharFlag = false
    this.panFlag = false
    this.billFlag = false
  }

}
