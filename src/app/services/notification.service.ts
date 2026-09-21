import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notificationApiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.notificationApiUrl}/api/student/notifications`
    );
  }

  createNotification(
    request: CreateNotificationRequest
  ): Observable<Notification> {
    return this.http.post<Notification>(
      `${this.notificationApiUrl}/api/admin/notifications`,
      request
    );
  }
}