/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AadhaarDetails, ElectricityBillDetails, PanDetails } from "../models/kyc";
export type DataNotification = {
  file?: File;
  data?: PanDetails | AadhaarDetails | ElectricityBillDetails;
};

@Injectable({
  providedIn: "root",
})
export class CourierService {
  constructor(private router: Router) {}

  private notify = new Subject<any>();
  private fetchSub = new Subject<any>();
  private alertSub = new Subject<any>();

  notifyObservable$ = this.notify.asObservable();
  alertObservable$ = this.alertSub.asObservable();
  fetchingObservable$ = this.fetchSub.asObservable();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public notifyOther(data: any): void {
    if (data) {
      this.notify.next(data);
    }
  }
}
