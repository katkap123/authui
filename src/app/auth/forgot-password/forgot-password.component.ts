import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ForgotPasswordRequest } from '../models/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotPasswordRequest: ForgotPasswordRequest = {
    email: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  forgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.forgotPasswordRequest.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword(
      this.forgotPasswordRequest
    ).subscribe({
      next: (response) => {
        this.loading = false;

        this.successMessage =
          response.message ||
          'If an account exists, a password reset link has been sent.';
      },

      error: (error) => {
        this.loading = false;

        console.error('Forgot password error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to process your request. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
