import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const teacherGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const roles: string[] = payload.roles || [];

    if (roles.includes('TEACHER')) {
      return true;
    }

    router.navigate(['/']);
    return false;

  } catch (error) {
    console.error('Invalid access token', error);

    router.navigate(['/login']);
    return false;
  }
};