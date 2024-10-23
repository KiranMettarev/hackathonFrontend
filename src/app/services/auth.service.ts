import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  Observable,
  catchError,
  firstValueFrom,
  from,
  map,
  switchMap,
  throwError,
  zipWith,
} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
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

  refreshToken(): Observable<LoginResponse> {
    const state$ = this.currentLoggedInUser();
    return state$
      .pipe(map((state) => state.tokens.refreshToken))
      .pipe(switchMap((refreshToken) => this.reissueToken(refreshToken)))
      .pipe(map((it) => it.accessToken))
      .pipe(zipWith(state$))
      .pipe(map((cons) => this.updateState(cons)))
      .pipe(
        switchMap((updated) => this.storeAuthState(updated)),
        catchError((error: unknown) => {
          if (!(error instanceof HttpErrorResponse && error.status === 400)) {
            this.localStorage.remove(this.storageKey);
            if (confirm("Session expire Please re-login"))
              window.location.reload();
          }

          return throwError(() => error);
        }),
      );
  }

  private storeAuthState(updated: LoginResponse): Promise<LoginResponse> {
    return this.localStorage.update(this.storageKey, updated);
  }

  private updateState(cons: [arg: string, LoginResponse]) {
    const [accessToken, state] = cons;
    state.tokens.accessToken = accessToken;
    return state;
  }

  private reissueToken(
    refreshToken: string,
  ): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>("refresh", {
      refreshToken,
    });
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
  refreshToken: string;
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
