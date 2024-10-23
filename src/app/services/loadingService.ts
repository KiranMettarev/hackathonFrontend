import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private _loadingState = new BehaviorSubject<boolean>(false);
  private _progress = new BehaviorSubject<number>(0);
  private progressInterval?: number; // Track the interval

  get loadingState(): Observable<boolean> {
    return this._loadingState.asObservable();
  }

  get progress(): Observable<number> {
    return this._progress.asObservable();
  }

  startLoading(): void {
    this._loadingState.next(true);
    this._progress.next(0);
    this.setProgress(0);
  }

  stopLoading(): void {
    this._loadingState.next(false);
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this._progress.next(100);
  }

  setProgress(progress: number): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval); // Clear any existing interval
    }

    this.progressInterval = window.setInterval(() => {
      if (progress < 100) {
        this._progress.next(progress);
      } else {
        clearInterval(this.progressInterval);
        this.stopLoading();
      }
    }, 500);
  }
}
