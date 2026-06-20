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

@Component({
selector: 'app-register',
standalone: true,
imports: [
CommonModule,
RouterLink,
ReactiveFormsModule
],
templateUrl: './register.html',
styleUrl: './register.css'
})
export class Register {
registerForm: FormGroup;
loading = false;

constructor(
private fb: FormBuilder,
private authService: Auth,
private router: Router
) {
this.registerForm = this.fb.group({
name: ['', [Validators.required]],
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]],
confirmPassword: ['', [Validators.required]]
});
}

onSubmit(): void {
if (this.registerForm.invalid) {
this.registerForm.markAllAsTouched();

  this.showWarning(
    'Complete Your Details',
    'Please fill all required fields before creating your account.'
  );

  return;
}

const { name, email, password, confirmPassword } =
  this.registerForm.value;

if (password !== confirmPassword) {
  this.showError(
    'Password Does Not Match',
    'Password and Confirm Password must be the same.'
  );

  return;
}

this.loading = true;

this.authService.register({
  name,
  email,
  password
}).subscribe({
  next: (response: any) => {
    this.loading = false;

    Swal.fire({
      icon: 'success',
      title: 'Account Created!',
      text: response?.message || 'Your EMS account has been created successfully.',
      confirmButtonText: 'Continue to Login',
      confirmButtonColor: '#2563eb',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'ems-alert-popup',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: 'ems-alert-button ems-alert-success-button',
        icon: 'ems-alert-icon'
      }
    }).then(() => {
      this.router.navigate(['/login']);
    });
  },

  error: (error: any) => {
    this.loading = false;

    console.error('Registration Error:', error);

    this.showError(
      'Registration Failed',
      error?.error?.message ||
        'We could not create your account. Please try again.'
    );
  }
});


}

private showWarning(title: string, message: string): void {
Swal.fire({
icon: 'warning',
title,
text: message,
confirmButtonText: 'Review Form',
confirmButtonColor: '#f59e0b',
heightAuto: false,
customClass: {
popup: 'ems-alert-popup',
title: 'ems-alert-title',
htmlContainer: 'ems-alert-message',
confirmButton: 'ems-alert-button ems-alert-warning-button',
icon: 'ems-alert-icon'
}
});
}

private showError(title: string, message: string): void {
Swal.fire({
icon: 'error',
title,
text: message,
confirmButtonText: 'Try Again',
confirmButtonColor: '#dc2626',
heightAuto: false,
customClass: {
popup: 'ems-alert-popup',
title: 'ems-alert-title',
htmlContainer: 'ems-alert-message',
confirmButton: 'ems-alert-button ems-alert-error-button',
icon: 'ems-alert-icon'
}
});
}
}
