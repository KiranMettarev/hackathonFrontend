import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Env } from "../../environments/env";

@Injectable({ providedIn: "root" })
export class HttpService {
  private apiUrl = environment.backendApi;
  constructor(private http: HttpClient) {}

  get<Response>(url: string, queryParams?: QueryParam): Observable<Response> {
    return this.http
      .get<{ data: Response }>(this.apiUrl + "/" + url, {
        headers: this.requestHeaders(),
        params: queryParams || {},
      })
      .pipe(map(({ data }) => data));
  }

  post<Response>(url: string, body?: unknown | null): Observable<Response> {
    return this.http
      .post<{ data: Response }>(this.apiUrl + "/" + url, body, {
        headers: this.requestHeaders(),
      })
      .pipe(map(({ data }) => data));
  }

  put<Response, Body>(url: string, body?: Body): Observable<Response> {
    return this.http.put<Response>(this.apiUrl + "/" + url, body, {
      headers: this.requestHeaders(),
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFile(url: string, queryParams?: QueryParam): Observable<ArrayBuffer> {
    return this.http.get(this.apiUrl + "/" + url, {
      headers: this.requestHeaders(),
      params: queryParams || {},
      responseType: "arraybuffer",
    });
  }

  postFile<Response>(url: string, body?: FormData): Observable<Response> {
    return this.http
      .post<{ data: Response }>(this.apiUrl + "/" + url, body, {
        headers: this.requestHeaders(),
      })
      .pipe(map(({ data }) => data));
  }
  private requestHeaders() {
    return environment.env != Env.production
      ? this.crossOriginOptions
      : new HttpHeaders();
  }
  private crossOriginOptions = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Access-Control-Allow-Origin": "*",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Access-Control-Allow-Headers": "origin, x-requested-with, content-type",
  });
}
export type QueryParam =
  | HttpParams
  | {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };
