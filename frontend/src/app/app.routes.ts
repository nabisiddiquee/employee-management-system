import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { AddEmployee } from './pages/add-employee/add-employee';
import { EditEmployee } from './pages/edit-employee/edit-employee';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'employees',
    component: Employees,
    canActivate: [authGuard]
  },

  {
    path: 'add-employee',
    component: AddEmployee,
    canActivate: [authGuard]
  },

  {
    path: 'edit-employee/:id',
    component: EditEmployee,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
