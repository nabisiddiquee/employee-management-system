import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Auth } from '../../core/services/auth';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
    resetPasswordForm: FormGroup;
    loading = false;
    token = '';

    showNewPassword = false;
    showConfirmPassword = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: Auth
    ) {
        this.resetPasswordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') || '';

        if (!this.token) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Reset Link',
                text: 'Reset token is missing. Please request a new password reset link.',
                confirmButtonText: 'Back to Login',
                heightAuto: false
            }).then(() => {
                this.router.navigate(['/login']);
            });
        }
    }

    toggleNewPassword(): void {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPassword(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();

            Swal.fire({
                icon: 'warning',
                title: 'Invalid Password',
                text: 'Please enter a password with at least 6 characters.',
                confirmButtonText: 'OK',
                heightAuto: false
            });

            return;
        }

        const { newPassword, confirmPassword } = this.resetPasswordForm.value;

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Password Mismatch',
                text: 'New password and confirm password do not match.',
                confirmButtonText: 'OK',
                heightAuto: false
            });

            return;
        }

        this.loading = true;

        this.authService.resetPassword(this.token, newPassword).subscribe({
            next: (response: any) => {
                this.loading = false;

                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful!',
                    text:
                        response?.message ||
                        'Your password has been reset successfully. Please login again.',
                    confirmButtonText: 'Go to Login',
                    heightAuto: false
                }).then(() => {
                    this.router.navigate(['/login']);
                });
            },
            error: (error: any) => {
                this.loading = false;

                Swal.fire({
                    icon: 'error',
                    title: 'Reset Failed',
                    text:
                        error?.error?.message ||
                        'Invalid or expired reset link. Please request a new reset link.',
                    confirmButtonText: 'Try Again',
                    heightAuto: false
                });
            }
        });
    }
}