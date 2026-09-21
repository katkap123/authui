import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-create-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-notification.component.html',
  styleUrl: './admin-create-notification.component.css'
})
export class AdminCreateNotificationComponent {

  title = '';
  message = '';

  successMessage = '';
  errorMessage = '';
  submitting = false;

  constructor(private notificationService: NotificationService) {}

  createNotification(): void {

    this.successMessage = '';
    this.errorMessage = '';
    this.submitting = true;

    const request = {
      title: this.title,
      message: this.message
    };

    this.notificationService.createNotification(request).subscribe({
      next: () => {
        this.successMessage = 'Notification created successfully.';
        this.title = '';
        this.message = '';
        this.submitting = false;
      },
      error: (error) => {
        console.error('Failed to create notification', error);
        this.errorMessage = 'Unable to create notification.';
        this.submitting = false;
      }
    });
  }
}