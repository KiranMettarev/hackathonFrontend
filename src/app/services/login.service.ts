import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: "root" })
export class LoginService {

    constructor(private httpService: HttpService) {}

    generateOTP(mobileNumber: string):Observable<any> {
      return this.httpService.post("otp/generateOtp",mobileNumber)
    }
}


