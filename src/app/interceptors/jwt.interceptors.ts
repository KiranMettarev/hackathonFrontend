import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, catchError, map, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);

  if (req.url.includes("/otp/authenticate") || req.url.includes("/refresh") || req.url.includes("/otp/generateOtp")) {
    return next(req);
  }
  return enrichWithAccessToken(authService, req, next);
};

function enrichWithAccessToken(
  authService: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return authService
    .currentLoggedInUser()
    .pipe(map((userState) => userState.tokens.accessToken))
    .pipe(
      map((accessToken) =>
        req.clone({
          setHeaders: {
            authorization: `Bearer ${accessToken}`,
          },
        }),
      ),
    )
    .pipe(switchMap((req) => next(req)));
}

