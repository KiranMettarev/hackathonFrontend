import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { DocRequest } from "../models/type";
import { StringOrNull } from "../models/user-details";

@Injectable({
  providedIn: "root",
})
export class DocAPIService {
  constructor(private httpService: HttpService) {}

  getBill(billDetails: DocRequest): Observable<any> {
    return this.httpService.post("doc/electricity", billDetails);
  }

  getPanDetails(panDetails: any): Observable<any> {
    return this.httpService.post("api/kyc/pannumber", panDetails);
  }
  getAadharOTP(adharDetails: DocRequest): Observable<any> {
    return this.httpService.post("doc/adhaar/otp", adharDetails);
  }
  getAadhar(adharDetails: any): Observable<any> {
    return this.httpService.post("api/kyc/adhaar", adharDetails);
  }
  getBankStatementAnalysis(request: DocRequest): Observable<any> {
    return this.httpService.post("doc/bs/analyze", request);
  }
  getAA(request: DocRequest): Observable<any> {
    return this.httpService.post("finvu/consent", request);
  }
  fetchAAData(request: DocRequest): Observable<any> {
    return this.httpService.post("finvu/fetchData", request);
  }
}
