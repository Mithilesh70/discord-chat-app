import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.routes').then((route) => route.LAYOUT_ROUTES),
    // canActivate: [authGuard],
  },
];
