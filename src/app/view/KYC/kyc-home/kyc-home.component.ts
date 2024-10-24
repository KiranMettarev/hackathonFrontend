import { Component, EventEmitter, Output } from '@angular/core';
import { AadhaarDetails, PanDetails } from '../../../models/kyc';
import { CallBackEvent } from '../../../models/user-details';

@Component({
  selector: 'app-kyc-home',
  templateUrl: './kyc-home.component.html',
  styleUrl: './kyc-home.component.css'
})
export class KycHomeComponent {

  @Output() step = new EventEmitter();
  
  aadhaarDataFlag: boolean = false
  panDataFlag: boolean = false
  adharDetails!: AadhaarDetails
  panDetails!: PanDetails

  aadharFlag: boolean = false
  panFlag: boolean = false


    fetchKYC(iVal: string): void {
    switch (iVal) {
      case 'aadhar':
        this.aadharFlag = true
        break;
      case 'pan':
        this.panFlag = true
        break;
    
      default:
        break;
    }
  }

  aadhaarInfo(adhar: AadhaarDetails): void {
    this.adharDetails = adhar
    this.aadhaarDataFlag = true
    console.log(adhar, "workAdhar");
    
  }

  panInfo(pan: PanDetails): void {
     this.panDetails = pan
    this.panDataFlag = true
    console.log(pan, "workPan");
  }

  callBack(iVal: CallBackEvent): void {
    console.log(iVal, "ivalAdhar");
    
    this.aadharFlag = false
    this.panFlag = false
  }

  next(iVal: number): void {
    this.step.emit(iVal)
  }

}
