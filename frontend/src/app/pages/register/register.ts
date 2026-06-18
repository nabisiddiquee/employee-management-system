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


  Swal.fire({
    icon: 'warning',
    title: 'Incomplete Form',
    text: 'Please fill all required fields correctly.',
    confirmButtonColor: '#2563eb'
  });

  return;
}

const { name, email, password, confirmPassword } =
  this.registerForm.value;

if (password !== confirmPassword) {
  Swal.fire({
    icon: 'error',
    title: 'Password Mismatch',
    text: 'Password and Confirm Password must be the same.',
    confirmButtonColor: '#dc2626'
  });

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
      title: 'Account Created Successfully!',
      text: response?.message || 'You can now login to your account.',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#2563eb',
      allowOutsideClick: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  },

  error: (error: any) => {
    this.loading = false;

    console.error('Registration Error:', error);

    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text:
        error?.error?.message ||
        'Unable to create the account. Please try again.',
      confirmButtonColor: '#dc2626'
    });
  }
});


}
}
