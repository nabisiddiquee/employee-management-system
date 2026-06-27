import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }
}