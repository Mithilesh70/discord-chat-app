import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { catchError, map, of } from 'rxjs';
import { ApiService } from '../service/api.service';
import { CoreService } from '../service/core.service';

export const pageDataResolver =
  (
    apiUrl: string,
    useRouteId = true,
    redirectTo: string,
    showToast = false,
    idKey = 'id'
  ): ResolveFn<any> =>
  (route, state) => {
    const apiSerivce: ApiService = inject(ApiService);
    const coreService = inject(CoreService);
    const routeId = useRouteId ? route.params[idKey] : '';
    const finalApiUrl = routeId ? `${apiUrl}/${routeId}` : apiUrl;
    console.log('calling');

    return apiSerivce.get(finalApiUrl).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        // Handle API error here

        // Redirect to the specified error page
        coreService.navigateTo([redirectTo || '/']);

        // Optionally, show a toast message
        if (showToast) {
          coreService.showToast(
            'error',
            error?.error?.msg || 'API Error: Unable to fetch data'
          );
        }

        // Return an empty observable or handle the error as needed
        return of(null);
      })
    );
  };
