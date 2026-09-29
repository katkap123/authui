import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Attendance,
  AttendanceService
} from '../services/attendance.service';

interface CalendarDay {
  date: Date | null;
  dateString: string | null;
  attendance: Attendance[];
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-attendance.component.html',
  styleUrl: './student-attendance.component.css'
})
export class StudentAttendanceComponent implements OnInit {

  currentDate = new Date();

  calendarDays: CalendarDay[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadMonth();
  }

  get monthTitle(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

    this.loadMonth();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.loadMonth();
  }

  loadMonth(): void {

    this.loading = true;
    this.errorMessage = '';

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const startDate =
      this.formatDate(new Date(year, month, 1));

    const endDate =
      this.formatDate(new Date(year, month + 1, 0));

    this.attendanceService
      .getMyAttendance(startDate, endDate)
      .subscribe({

        next: (attendance) => {
          this.buildCalendar(attendance);
          this.loading = false;
        },

        error: (error) => {
          console.error(
            'Failed to load attendance',
            error
          );

          this.errorMessage =
            'Unable to load attendance.';

          this.loading = false;
        }
      });
  }

  private buildCalendar(
    attendanceRecords: Attendance[]
  ): void {

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({
        date: null,
        dateString: null,
        attendance: []
      });
    }

    // Actual days
    for (let day = 1; day <= lastDay.getDate(); day++) {

      const date = new Date(year, month, day);

      const dateString = this.formatDate(date);

      const dayAttendance =
        attendanceRecords.filter(
          record =>
            record.attendanceDate === dateString
        );

      days.push({
        date,
        dateString,
        attendance: dayAttendance
      });
    }

    this.calendarDays = days;
  }

  private formatDate(date: Date): string {

    const year = date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(date.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}