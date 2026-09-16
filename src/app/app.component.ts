import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {

    const refreshToken = this.authService.getRefreshToken();

    if (!refreshToken) {
      this.authService.clearTokens();
      this.router.navigate(['/login']);
      return;
    }

    this.authService.logout({
      refreshToken
    }).subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if the backend logout fails,
        // clear the local session.
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }
}