import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs';
import { LoaderService } from '../service/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService: LoaderService = inject(LoaderService);
  loaderService.start();
  console.log('loader');
  return next(req).pipe(finalize(() => loaderService.stop()));
};
