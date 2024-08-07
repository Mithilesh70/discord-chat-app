import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { CoreService } from '../service/core.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const coreService: CoreService = inject(CoreService);

  const showToast = (error: HttpErrorResponse, message: string) => {
    /**
     * send 'X-Show-Toast' false if dont want to show error toaster message
     */
    if (req.headers.get('X-Show-Toast') !== 'false') {
      coreService.showToast('error', message);
    }
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        showToast(error, error?.error?.message);
        // coreService.navigateTo(["/login"]);
        /**
         * Perform action here for Unauthorized user
         */
      } else if (error.status === 404) {
        showToast(error, 'Resource not found.');
      } else if (error.status === 500) {
        showToast(error, 'Server error. Please try again later.');
      } else if (error.status === 400 || error.status === 429) {
        showToast(error, error.error.message || 'Bad Request');
      } else {
        showToast(error, 'An error occurred.');
        // coreService.navigateTo(["/login"]);
        /**
         * Perform action here for Unknown error
         */
      }

      // Rethrow the error to propagate it to the components
      return throwError(() => error);
    })
  );
};
