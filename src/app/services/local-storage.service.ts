import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
  constructor() {}

  insert<Data>(key: string, data: Data): Promise<Data> {
    if (!this.exists(key)) {
      localStorage.setItem(key, JSON.stringify(data));
      return Promise.resolve(data);
    } else return Promise.reject({ key, message: `key ${key} already used` });
  }

  update<Data>(key: string, data: Data): Promise<Data> {
    if (this.exists(key)) {
      localStorage.setItem(key, JSON.stringify(data));
      return Promise.resolve(data);
    } else return Promise.reject({ key, message: `key ${key} not found` });
  }

  get<Data>(key: string): Promise<Data> {
    const data = localStorage.getItem(key);
    return data
      ? Promise.resolve(JSON.parse(data) as Data)
      : Promise.reject({ key, message: `key ${key} not found` });
  }

  remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }

  clearAll(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }

  exists(key: string): boolean {
    return !!localStorage.getItem(key);
  }
}
