import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  CreateEmployeeRequest,
  Employee
} from '../../core/services/employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee implements OnInit {
  userEmail = signal('[admin@ems.com](mailto:admin@ems.com)');
  loading = signal(false);

  employeeForm: FormGroup;

  departments = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Sales',
    'Marketing',
    'Operations',
    'Support'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: Employee,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.employeeForm = this.fb.group({
      employeeCode: ['', [Validators.required, Validators.minLength(2)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/)
        ]
      ],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(1)]],
      status: ['ACTIVE', [Validators.required]],
      joiningDate: [this.getTodayDate(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }


    const token = window.localStorage.getItem('ems_token');

    if (!token || token.trim().length === 0) {
      this.router.navigate(['/login']);
      return;
    }

    const email =
      window.localStorage.getItem('ems_user_email') || 'admin@ems.com';

    this.userEmail.set(email);


  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();


      this.showAlert(
        'warning',
        'Incomplete Employee Details',
        'Please fill all required employee details correctly.',
        'Review Form'
      );

      return;
    }

    const formValue = this.employeeForm.value;

    const request: CreateEmployeeRequest = {
      employeeCode: String(formValue.employeeCode).trim(),
      firstName: String(formValue.firstName).trim(),
      lastName: String(formValue.lastName || '').trim(),
      email: String(formValue.email).trim(),
      mobile: String(formValue.mobile).trim(),
      department: String(formValue.department).trim(),
      salary: Number(formValue.salary),
      status: formValue.status,
      joiningDate: formValue.joiningDate
    };

    this.loading.set(true);

    this.employeeService.createEmployee(request).subscribe({
      next: () => {
        this.loading.set(false);

        Swal.fire({
          icon: 'success',
          iconColor: '#22c55e',
          title: 'Employee Added!',
          text: 'Employee has been created successfully.',
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false,
          buttonsStyling: false,
          customClass: {
            container: 'ems-alert-container',
            popup: 'ems-alert-popup ems-alert-success',
            icon: 'ems-alert-icon',
            title: 'ems-alert-title',
            htmlContainer: 'ems-alert-message'
          }
        }).then(() => {
          this.router.navigate(['/employees']);
        });
      },

      error: (error: any) => {
        this.loading.set(false);

        console.error('Create Employee Error:', error);

        if (error?.status === 401 || error?.status === 403) {
          this.showAlert(
            'error',
            'Access Denied',
            'Only ADMIN users can create employees. Please login with an ADMIN account.',
            'Okay'
          );

          return;
        }

        this.showAlert(
          'error',
          'Employee Creation Failed',
          error?.error?.message ||
          'Unable to create employee. Please check backend validation.',
          'Try Again'
        );
      }
    });


  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  logout(): void {
    Swal.fire({
      icon: 'question',
      iconColor: '#2563eb',
      title: 'Logout?',
      text: 'Are you sure you want to logout from EMS?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      heightAuto: false,
      customClass: {
        container: 'ems-alert-container',
        popup: 'ems-alert-popup ems-alert-warning',
        icon: 'ems-alert-icon',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: 'ems-alert-button ems-alert-button-error',
        cancelButton: 'ems-alert-button ems-alert-button-warning'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (isPlatformBrowser(this.platformId)) {
          window.localStorage.removeItem('ems_token');
          window.localStorage.removeItem('ems_user_email');
        }


        this.router.navigate(['/login']);
      }
    });


  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private showAlert(
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string,
    buttonText: string
  ): void {
    const iconColorMap = {
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
      heightAuto: false,
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
