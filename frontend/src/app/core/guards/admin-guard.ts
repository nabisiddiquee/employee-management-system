import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = window.localStorage.getItem('ems_token');
  const role = window.localStorage.getItem('ems_user_role');

  if (!token || token.trim().length === 0) {
    return router.createUrlTree(['/login']);
  }

  if (role && role.toUpperCase() === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/employees']);
};
