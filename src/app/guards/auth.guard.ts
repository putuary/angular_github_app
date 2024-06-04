import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated  : boolean = localStorage.getItem('token') ? true : false;

  if(!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};