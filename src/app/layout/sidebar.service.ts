import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isSidebarClose = signal(false);
  constructor() {}
  toggleSidebar() {
    this.isSidebarClose.update((value) => !value);
  }
}
