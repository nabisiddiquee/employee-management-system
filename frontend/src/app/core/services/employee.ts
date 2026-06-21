import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmployeeModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: number;
  active?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Employee {
  private baseUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getEmployeesWithPagination(
    page: number = 0,
    size: number = 5,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);


    return this.http.get<any>(this.baseUrl, { params });


  }
}
