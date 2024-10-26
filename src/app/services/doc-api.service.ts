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
    return this.httpService.post("kyc/pannumber", panDetails);
  }
  getAadharOTP(adharDetails: DocRequest): Observable<any> {
    return this.httpService.post("doc/adhaar/otp", adharDetails);
  }
  getAadhar(adharDetails: any): Observable<any> {
    return this.httpService.post("kyc/adhaar", adharDetails);
  }
  getBankStatementAnalysis(request: DocRequest): Observable<any> {
    return this.httpService.post("doc/bs/analyze", request);
  }
  loginAA(request: DocRequest): Observable<any> {
    return this.httpService.post("aa/call", request);
  }
  consentAAData(request: DocRequest): Observable<any> {
    return this.httpService.post(`aa/consent-details/${request.mobileNumber}`);
  }
  checkConsent(): Observable<any> {
    return this.httpService.get("aa/check-consent-status");
  }
}
