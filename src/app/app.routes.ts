import { Routes } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdminCreateNotificationComponent } from './components/admin-create-notification/admin-create-notification.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { teacherGuard } from './guards/teacher.guard';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { studentGuard } from './guards/student.guard';

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
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'admin/notifications/create',
    component: AdminCreateNotificationComponent
  },
  {
    path: 'teacher/attendance',
    component: TeacherAttendanceComponent,
    canActivate: [teacherGuard]
  },
  {
    path: 'student/attendance',
    component: StudentAttendanceComponent,
    canActivate: [studentGuard]
  }

];
