import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(
        m => m.LoginComponent
      )
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then(
        m => m.SignupComponent
      )
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent
      )
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent
      )
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/welcome.component')
        .then(m => m.WelcomeComponent)
  }

];
