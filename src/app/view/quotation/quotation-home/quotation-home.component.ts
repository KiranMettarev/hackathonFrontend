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

  ngOnInit(){
    console.log(this.fileFlag, "console")
  }

  redirect(): void {
      this.router.navigate(['user/offers']);
  }

  fileUpload(iFlag: boolean): void {
    console.log(iFlag, "iFlag");
    
      this.fileFlag = iFlag
      console.log(this.fileFlag, "fileFlag")
  }
}
