import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest } from '../../auth/models/login-request';
import { SignupRequest } from '../../auth/models/signup-request';
import { SignupResponse } from '../../auth/models/signup-response';
import { ForgotPasswordRequest } from '../../auth/models/forgot-password-request';
import { ForgotPasswordResponse } from '../../auth/models/forgot-password-response';
import { ResetPasswordRequest } from '../../auth/models/reset-password-request';
import { RefreshTokenRequest } from '../../auth/models/refresh-token-request';
import { AuthResponse } from '../../auth/models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/api/auth/login`,
      request
    );
  }

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(
      `${this.apiUrl}/api/auth/signup`,
      request
    );
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/api/auth/forgot-password`,
      request
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/auth/reset-password`,
      request
    );
  }

  refresh(
    request: RefreshTokenRequest
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/api/auth/refresh`,
      request
    );
  }

  logout(
    request: RefreshTokenRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/auth/logout`,
      request
    );
  }
  
  saveTokens(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}