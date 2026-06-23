import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Auth } from '../../core/services/auth';

type AlertType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();


      this.showPremiumAlert(
        'warning',
        'Incomplete Login Details',
        'Please enter a valid email address and password.',
        'Review Form'
      );

      return;
    }

    const { email, password } = this.loginForm.value;

    this.loading = true;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        this.loading = false;

        const token =
          response?.data?.token ||
          response?.token ||
          response?.accessToken ||
          response?.jwtToken;

        if (!token) {
          console.error('Login Response:', response);

          this.showPremiumAlert(
            'error',
            'Token Missing',
            'Login successful, but JWT token was not found in backend response.',
            'Check Backend'
          );

          return;
        }

        const role =
          response?.data?.role ||
          response?.role ||
          this.extractRoleFromToken(token);

        localStorage.setItem('ems_token', token);
        localStorage.setItem('ems_user_email', email);
        localStorage.setItem('ems_user_role', role);

        Swal.fire({
          icon: 'success',
          iconColor: '#22c55e',
          title: 'Login Successful!',
          text: 'Redirecting to your EMS dashboard...',
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false,
          buttonsStyling: false,
          showClass: {
            popup: 'ems-alert-show'
          },
          hideClass: {
            popup: 'ems-alert-hide'
          },
          customClass: {
            container: 'ems-alert-container',
            popup: 'ems-alert-popup ems-alert-success',
            icon: 'ems-alert-icon',
            title: 'ems-alert-title',
            htmlContainer: 'ems-alert-message'
          }
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },

      error: (error: any) => {
        this.loading = false;

        console.error('Login Error:', error);

        this.showPremiumAlert(
          'error',
          'Login Failed',
          error?.error?.message ||
          'Invalid email or password. Please try again.',
          'Try Again'
        );
      }
    });


  }

  private extractRoleFromToken(token: string): string {
    try {
      const cleanToken = token.replace('Bearer ', '');
      const payload = JSON.parse(atob(cleanToken.split('.')[1]));


      const role =
        payload?.role ||
        payload?.authority ||
        payload?.authorities?.[0] ||
        'USER';

      return String(role).replace('ROLE_', '').toUpperCase();
    } catch (error) {
      console.error('Token Role Decode Error:', error);
      return 'USER';
    }


  }

  private showPremiumAlert(
    type: AlertType,
    title: string,
    message: string,
    buttonText: string
  ): void {
    const iconColorMap: Record<AlertType, string> = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    };


    Swal.fire({
      icon: type,
      iconColor: iconColorMap[type],
      title,
      text: message,
      confirmButtonText: buttonText,
      buttonsStyling: false,
      allowOutsideClick: type !== 'success',
      allowEscapeKey: type !== 'success',
      heightAuto: false,
      showClass: {
        popup: 'ems-alert-show'
      },
      hideClass: {
        popup: 'ems-alert-hide'
      },
      customClass: {
        container: 'ems-alert-container',
        popup: `ems-alert-popup ems-alert-${type}`,
        icon: 'ems-alert-icon',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: `ems-alert-button ems-alert-button-${type}`
      }
    });


  }
}
