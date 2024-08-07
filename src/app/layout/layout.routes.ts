import { Route } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { pageDataResolver } from '../core/resolvers/page-data.resolver';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: '',
        redirectTo: 'chat-room',
        pathMatch: 'full',
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('../component/employee/list/list.component'),
      },
      {
        path: 'chat-room',
        loadComponent: () =>
          import('../component/chat-room/chat-room.component'),
      },
      {
        path: 'employees/create',
        loadComponent: () =>
          import('../component/employee/manage/manage.component'),
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('../component/employee/manage/manage.component'),
        resolve: {
          employeeDetail: pageDataResolver('employee', true, 'employee'),
        },
      },
      {
        path: 'error',
        loadComponent: () => import('../component/error/error.component'),
      },
      {
        path: '**',
        redirectTo: 'error',
      },
    ],
  },
];
