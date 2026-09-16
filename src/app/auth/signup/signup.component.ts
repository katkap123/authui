import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { SignupRequest } from '../models/signup-request';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupRequest: SignupRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signup(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.signupRequest.firstName ||
      !this.signupRequest.lastName ||
      !this.signupRequest.email ||
      !this.signupRequest.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.signupRequest.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    if (this.signupRequest.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.signup(this.signupRequest).subscribe({
      next: (response) => {
        this.loading = false;

        this.successMessage =
          response.message || 'Account created successfully.';

        console.log('Signup successful:', response);

        this.signupRequest = {
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        };

        this.confirmPassword = '';
      },

      error: (error) => {
        this.loading = false;

        console.error('Signup error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to create your account. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
