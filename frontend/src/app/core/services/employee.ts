import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmployeeModel {
    id?: number;
    employeeCode?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    department?: string;
    designation?: string;
    salary?: number;
    status?: string;
    joiningDate?: string;
    active?: boolean;
    isActive?: boolean;
}

export interface CreateEmployeeRequest {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    department: string;
    salary: number;
    status: 'ACTIVE' | 'INACTIVE';
    joiningDate: string;
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

    createEmployee(request: CreateEmployeeRequest): Observable<any> {
        return this.http.post<any>(this.baseUrl, request);
    }
}
