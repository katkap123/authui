import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ResetPasswordRequest } from '../models/reset-password-request';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordRequest: ResetPasswordRequest = {
    token: '',
    newPassword: ''
  };

  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');

      if (token) {
        this.resetPasswordRequest.token = token;
      } else {
        this.errorMessage =
          'Password reset token is missing or invalid.';
      }
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetPasswordRequest.token) {
      this.errorMessage =
        'Password reset token is missing or invalid.';
      return;
    }

    if (!this.resetPasswordRequest.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    if (this.resetPasswordRequest.newPassword.length < 8) {
      this.errorMessage =
        'Password must be at least 8 characters.';
      return;
    }

    if (this.resetPasswordRequest.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword(
      this.resetPasswordRequest
    ).subscribe({
      next: () => {
        this.loading = false;

        this.successMessage =
          'Your password has been reset successfully.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.loading = false;

        console.error('Reset password error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to reset your password. The reset link may have expired or already been used.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
