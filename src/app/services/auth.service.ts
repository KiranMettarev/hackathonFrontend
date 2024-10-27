import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  Observable,
  catchError,
  from,
  map,
  switchMap,
  throwError,
} from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { ErrorHandlerService } from "./error-handler.service";
import { LoginForm, UserModel } from "../models/user-details";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private http: HttpService,
    private localStorage: LocalStorageService,
    private errorHandler: ErrorHandlerService,
  ) {}

  private readonly storageKey = "auth";

    login(loginRequest: LoginForm): Observable<LoginResponse> {    
    return this.http.post<LoginResponse>("otp/authenticate", loginRequest).pipe(
      switchMap((r) => this.localStorage.insert(this.storageKey, r)),
      catchError((error: unknown) =>
        throwError(() => this.errorHandler.handleAuthError(error)),
      ),
    );
  }

  private accessToken: string | null = null;

generateOTP(mobileNumber: string): Observable<OtpResponse> {
  return this.http.post<OtpResponse>("otp/generateOtp", { mobileNumber }).pipe(
    map((response: OtpResponse) => response),
    catchError((error: unknown) =>
      throwError(() => this.errorHandler.handleOtpError(error))
    ),
  );
}

  logout(): Observable<void> {
    return this.http
      .post<LoginResponse>("logout", {})
      .pipe(switchMap(() => this.localStorage.remove(this.storageKey)));
  }

  currentLoggedInUser(): Observable<LoginResponse> {
    return from(this.localStorage.get<LoginResponse>(this.storageKey));
  }

  toModel(userDetails: UserDetails): {
    fullName: string;
    initials: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bankId: string | null;
    role: Role;
  } {
    return {
      ...userDetails,
      fullName: `${userDetails.firstName} ${userDetails.lastName}`,
      initials: `${this.initial(userDetails.firstName)} ${this.initial(userDetails.lastName)}`,
    };
  }

  initial(name: string): string {
    return name.charAt(0).toLocaleUpperCase();
  }
}


export type LoginResponse = {
  tokens: Tokens;
};

export type OtpResponse = {
  otp: string
}

export type Tokens = {
  accessToken: string;
};
export type UserDetails = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bankId: string | null;
  role: Role;
};
export enum Role {
  systemAdmin = "system_admin",
  applicant = "applicant",
  agent = "agent",
  loanOfficer = "loan_officer",
  dsa = "dsa"
}
