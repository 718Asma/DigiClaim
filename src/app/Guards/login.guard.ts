import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../Services/users.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const usersService = inject(UsersService);

  if (usersService.isAuthenticated())
  {
    return true;
  }
  else
  {
    router.navigate(['/login']);
    return false;
  }};
