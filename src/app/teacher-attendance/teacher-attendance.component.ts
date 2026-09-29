import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AttendanceService,
  CreateAttendanceRequest
} from '../services/attendance.service';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './teacher-attendance.component.html',
  styleUrl: './teacher-attendance.component.css'
})
export class TeacherAttendanceComponent {

  attendance: CreateAttendanceRequest = {
    studentId: '',
    classId: '',
    className: '',
    attendanceDate: '',
    status: 'PRESENT'
  };

  message = '';
  errorMessage = '';
  submitting = false;

  constructor(
    private attendanceService: AttendanceService
  ) {}

  submitAttendance(): void {

    this.message = '';
    this.errorMessage = '';
    this.submitting = true;

    this.attendanceService
      .recordAttendance(this.attendance)
      .subscribe({
        next: () => {
          this.message = 'Attendance recorded successfully.';
          this.submitting = false;

          this.attendance = {
            studentId: '',
            classId: '',
            className: '',
            attendanceDate: '',
            status: 'PRESENT'
          };
        },

        error: (error) => {
          console.error('Failed to record attendance', error);

          this.errorMessage =
            'Unable to record attendance. Please try again.';

          this.submitting = false;
        }
      });
  }
}