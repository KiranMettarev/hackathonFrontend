import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PageLayout } from "./pageLayout";

@Injectable({
  providedIn: "root",
})
export class PageLayoutService {
  private layoutSubject = new Subject<PageLayout>();

  public layout$ = this.layoutSubject.asObservable();

  setLayout(value: PageLayout): void {
    this.layoutSubject.next(value);
  }
}
