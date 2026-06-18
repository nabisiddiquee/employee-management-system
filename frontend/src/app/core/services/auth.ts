import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  login(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, request);
  }
}