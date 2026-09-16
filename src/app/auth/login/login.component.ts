import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../models/login-request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService,  private router: Router) {}

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  login(): void {
    if (this.loading) {
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
  
    this.authService.login(this.loginRequest)
      .pipe(
        finalize(() => {
          // API has responded — success OR error
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.authService.saveTokens(response);
          this.router.navigate(['/welcome']);
        },
  
        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials.';
        }
      });
  }
}