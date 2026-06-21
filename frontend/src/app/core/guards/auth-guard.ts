import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During server-side rendering, localStorage is not available.
  // Allow route rendering on server, then browser will validate token.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = window.localStorage.getItem('ems_token');

  if (token && token.trim().length > 0) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
