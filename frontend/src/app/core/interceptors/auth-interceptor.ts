import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
const platformId = inject(PLATFORM_ID);

if (isPlatformBrowser(platformId)) {
const token = window.localStorage.getItem('ems_token');


if (token) {
  const cleanToken = token.replace('Bearer ', '');

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${cleanToken}`
    }
  });

  return next(authRequest);
}


}

return next(request);
};
