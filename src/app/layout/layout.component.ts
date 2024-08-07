import { Component, OnInit, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CoreService } from '../core/service/core.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SidebarService } from './sidebar.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../core/service/api.service';
import { Observable } from 'rxjs';
import { ChatService } from '../core/service/chat.service';
import { UserDetails } from '../shared/facades/chat';
import { ApiResponse } from '../shared/facades/api-response';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    NgbDropdownModule,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  sidebar = false;
  enableSearch = false;
  searchControl = new FormControl('');
  brandText = 'Employee Management';
  usersList: UserDetails[] = [];
  menus: {
    routerLink: string;
    label: string;
  }[] = [
    {
      label: 'Employees',
      routerLink: 'employees',
    },
    {
      label: 'Add Employee',
      routerLink: 'employees/create',
    },
  ];

  constructor(
    private router: Router,
    private coreService: CoreService,
    public sidebarService: SidebarService,
    private apiService: ApiService,
    public chatService: ChatService
  ) {
    effect(() => {
      if (this.coreService.updateState()?.event === 'employeeSearch') {
        this.searchControl.setValue(this.coreService.updateState()?.value, {
          emitEvent: false,
        });
      }
    });
  }

  ngOnInit(): void {
    // Initial check on component load
    this.checkUrl(this.router.url);

    // Subscribe to router events to handle subsequent navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkUrl(event.url);
      }
    });

    this.searchControl.valueChanges.subscribe((value) => {
      this.coreService.updateState.set({
        event: 'employeeSearch',
        value,
      });
    });

    this.apiService
      .post<ApiResponse<UserDetails[]>>('users/getUsersList', {})
      .subscribe((res) => {
        if (res) {
          this.usersList = res.data;
          this.chatService.changeUser(this.usersList[0]);
        }
      });
  }

  selectUser(event: UserDetails) {
    this.chatService.changeUser(event);
  }

  private checkUrl(url: string): void {
    if (url === '/employees') {
      this.enableSearch = true;
    } else {
      this.enableSearch = false;
    }
  }
}
