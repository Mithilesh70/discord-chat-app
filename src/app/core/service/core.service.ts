import { Injectable, signal } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  updateState = signal<{
    event: string;
    value: any;
  } | null>(null);
  constructor(private toastr: ToastrService, private router: Router) {}

  showToast(type: 'success' | 'error' | 'info' | 'warning', msg: string) {
    this.toastr[type](msg);
  }

  navigateTo(url: any[], option?: NavigationExtras) {
    this.router.navigate(url, option);
  }
}
