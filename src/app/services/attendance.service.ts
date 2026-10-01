import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SchoolClass {
  id: string;
  name: string;
  classTeacherId: string;
}

export interface StudentClass {
  id: string;
  studentId: string;
  classId: string;
}

export interface RecordClassAttendanceRequest {
  attendanceDate: string;
  absentStudentIds: string[];
}

export interface CreateAttendanceRequest {
  studentId: string;
  classId: string;
  className: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  className: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT';
  recordedBy: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly attendanceApiUrl =
    'https://attendanceapi-zdw2.onrender.com';

  constructor(private http: HttpClient) {}

  recordAttendance(
    request: CreateAttendanceRequest
  ): Observable<Attendance> {

    return this.http.post<Attendance>(
      `${this.attendanceApiUrl}/api/teacher/attendance`,
      request
    );
  }

  getMyAttendance(
    startDate: string,
    endDate: string
  ): Observable<Attendance[]> {

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<Attendance[]>(
      `${this.attendanceApiUrl}/api/student/attendance`,
      { params }
    );
  }

  getMyClasses(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(
      `${this.attendanceApiUrl}/api/teacher/classes`
    );
  }
  
  getClassStudents(classId: string): Observable<StudentClass[]> {
    return this.http.get<StudentClass[]>(
      `${this.attendanceApiUrl}/api/teacher/classes/${classId}/students`
    );
  }
  
  recordClassAttendance(
    classId: string,
    request: RecordClassAttendanceRequest
  ): Observable<Attendance[]> {
  
    return this.http.post<Attendance[]>(
      `${this.attendanceApiUrl}/api/teacher/attendance/class/${classId}`,
      request
    );
  }
}