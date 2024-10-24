import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-home',
  templateUrl: './quotation-home.component.html',
  styleUrl: './quotation-home.component.css'
})
export class QuotationHomeComponent {
  constructor( private router: Router,) {}

  redirect(): void {
      this.router.navigate(['user/offers']);
  }
}
