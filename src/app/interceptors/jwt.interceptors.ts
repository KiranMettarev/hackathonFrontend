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
export const unauthErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error instanceof HttpErrorResponse &&
        // this will avoid an infinite loop when the accessToken expires.
        !(req.url.includes("/otp/authenticate") || req.url.includes("/refresh") || req.url.includes("/otp/generateOtp")) &&
        error.status === 401
      ) {
        return authService
          .refreshToken()
          .pipe(
            switchMap((_it) => enrichWithAccessToken(authService, req, next)),
          );
      }

      return throwError(() => error);
    }),
  );
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
