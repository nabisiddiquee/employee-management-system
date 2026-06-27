import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Auth } from '../../core/services/auth';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css'
})
export class ForgotPassword {
    forgotPasswordForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: Auth
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            this.forgotPasswordForm.markAllAsTouched();

            Swal.fire({
                icon: 'warning',
                title: 'Invalid Email',
                text: 'Please enter a valid registered email address.',
                confirmButtonText: 'OK',
                heightAuto: false
            });

            return;
        }

        const email = this.forgotPasswordForm.value.email;

        this.loading = true;

        this.authService.forgotPassword(email).subscribe({
            next: (response: any) => {
                this.loading = false;

                Swal.fire({
                    icon: 'success',
                    title: 'Reset Link Sent!',
                    text:
                        response?.message ||
                        'Password reset link has been sent to your registered email.',
                    confirmButtonText: 'OK',
                    heightAuto: false
                });

                this.forgotPasswordForm.reset();
            },
            error: (error: any) => {
                this.loading = false;

                Swal.fire({
                    icon: 'error',
                    title: 'Request Failed',
                    text:
                        error?.error?.message ||
                        'Unable to send reset link. Please check your email and try again.',
                    confirmButtonText: 'Try Again',
                    heightAuto: false
                });
            }
        });
    }
}