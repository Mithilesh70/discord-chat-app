import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  loader = signal<boolean>(false);
  constructor() {}
  start() {
    this.loader.set(true);
  }
  stop() {
    this.loader.set(false);
  }
}
