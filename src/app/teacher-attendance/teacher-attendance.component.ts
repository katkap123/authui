import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AttendanceService,
  SchoolClass,
  StudentClass
} from '../services/attendance.service';

import {
  AuthService,
  UserSummary
} from '../core/services/auth.service';
@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-attendance.component.html',
  styleUrl: './teacher-attendance.component.css'
})
export class TeacherAttendanceComponent implements OnInit {
  studentProfiles = new Map<string, UserSummary>();
  classes: SchoolClass[] = [];
  students: StudentClass[] = [];

  selectedClassId = '';
  attendanceDate = '';

  absentStudentIds = new Set<string>();

  loadingClasses = false;
  loadingStudents = false;
  submitting = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.attendanceDate = this.getToday();
    this.loadClasses();
  }

  loadClasses(): void {
    this.loadingClasses = true;
    this.errorMessage = '';

    this.attendanceService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.loadingClasses = false;

        // If teacher has only one class, select it automatically.
        if (classes.length === 1) {
          this.selectedClassId = classes[0].id;
          this.loadStudents();
        }
      },
      error: () => {
        this.loadingClasses = false;
        this.errorMessage = 'Unable to load your classes.';
      }
    });
  }

  onClassChange(): void {
    this.students = [];
    this.absentStudentIds.clear();
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedClassId) {
      this.loadStudents();
    }
  }

  loadStudents(): void {
    if (!this.selectedClassId) {
      return;
    }

    this.loadingStudents = true;

    this.attendanceService
      .getClassStudents(this.selectedClassId)
      .subscribe({
        next: (students) => {
          this.students = students;
          this.studentProfiles.clear();
        
          const studentIds = students.map(
            student => student.studentId
          );
        
          if (studentIds.length === 0) {
            this.loadingStudents = false;
            return;
          }
        
          this.authService
            .getUserSummaries(studentIds)
            .subscribe({
              next: (profiles) => {
                profiles.forEach(profile => {
                  this.studentProfiles.set(
                    profile.id,
                    profile
                  );
                });
              
                this.loadingStudents = false;
              
                this.loadExistingAttendance();
              },
              error: () => {
                this.loadingStudents = false;
                this.errorMessage =
                  'Unable to load student details.';
              }
            });
        },
        error: () => {
          this.loadingStudents = false;
          this.errorMessage = 'Unable to load students.';
        }
      });
  }

  onDateChange(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.absentStudentIds.clear();
  
    if (this.selectedClassId) {
      this.loadExistingAttendance();
    }
  }

  getStudentName(studentId: string): string {
    const profile = this.studentProfiles.get(studentId);
  
    if (!profile) {
      return studentId;
    }
  
    const fullName = [
      profile.firstName,
      profile.lastName
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  
    return fullName || profile.email;
  }

  loadExistingAttendance(): void {
    if (!this.selectedClassId || !this.attendanceDate) {
      return;
    }
  
    this.absentStudentIds.clear();
  
    this.attendanceService
      .getClassAttendance(
        this.selectedClassId,
        this.attendanceDate
      )
      .subscribe({
        next: (attendance) => {
  
          attendance
            .filter(record => record.status === 'ABSENT')
            .forEach(record => {
              this.absentStudentIds.add(record.studentId);
            });
  
        },
        error: () => {
          this.errorMessage =
            'Unable to load existing attendance.';
        }
      });
  }

  markAllPresent(): void {
    this.absentStudentIds.clear();
  }
  
  markAllAbsent(): void {
    this.absentStudentIds = new Set(
      this.students.map(student => student.studentId)
    );
  }

  toggleAbsent(studentId: string): void {
    if (this.absentStudentIds.has(studentId)) {
      this.absentStudentIds.delete(studentId);
    } else {
      this.absentStudentIds.add(studentId);
    }
  }

  isAbsent(studentId: string): boolean {
    return this.absentStudentIds.has(studentId);
  }

  submitAttendance(): void {
    if (!this.selectedClassId || !this.attendanceDate) {
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.attendanceService
      .recordClassAttendance(
        this.selectedClassId,
        {
          attendanceDate: this.attendanceDate,
          absentStudentIds: Array.from(this.absentStudentIds)
        }
      )
      .subscribe({
        next: (attendance) => {
          this.submitting = false;

          const absentCount =
            attendance.filter(a => a.status === 'ABSENT').length;

          const presentCount =
            attendance.filter(a => a.status === 'PRESENT').length;

          this.successMessage =
            `Attendance saved. ${presentCount} present, ${absentCount} absent.`;
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'Unable to save attendance.';
        }
      });
  }

  private getToday(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}