import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  Employee,
  EmployeeModel
} from '../../core/services/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  userEmail = signal('[admin@ems.com](mailto:admin@ems.com)');

  currentTime = signal('--:--:--');
  currentDate = signal('--');
  currentDay = signal('--');

  totalEmployees = signal(0);
  activeEmployees = signal(0);
  departments = signal(0);
  recentEmployees = signal<EmployeeModel[]>([]);

  employeeLoading = signal(false);
  employeeError = signal('');

  private clockInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private employeeService: Employee,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const email =
        window.localStorage.getItem('ems_user_email') || '[admin@ems.com](mailto:admin@ems.com)';


      this.userEmail.set(email);

      this.updateClock();

      this.clockInterval = setInterval(() => {
        this.updateClock();
      }, 1000);

      this.loadEmployees();
    }


  }

  private loadEmployees(): void {
    this.employeeLoading.set(true);
    this.employeeError.set('');


    this.employeeService.getAllEmployees().subscribe({
      next: (response: any) => {
        this.employeeLoading.set(false);

        const employees = this.extractEmployees(response);

        this.totalEmployees.set(employees.length);
        this.recentEmployees.set(employees.slice(0, 5));

        const activeCount = employees.filter((employee) => {
          if (employee.active !== undefined) {
            return employee.active;
          }

          if (employee.isActive !== undefined) {
            return employee.isActive;
          }

          return true;
        }).length;

        this.activeEmployees.set(activeCount);

        const departmentCount = new Set(
          employees
            .map((employee) => employee.department)
            .filter((department) => !!department)
        ).size;

        this.departments.set(departmentCount);
      },

      error: (error: any) => {
        this.employeeLoading.set(false);
        this.employeeError.set(
          error?.error?.message ||
          'Unable to load employees. Please check backend API.'
        );

        console.error('Employee API Error:', error);
      }
    });


  }

  private extractEmployees(response: any): EmployeeModel[] {
    if (Array.isArray(response)) {
      return response;
    }


    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data?.content)) {
      return response.data.content;
    }

    if (Array.isArray(response?.employees)) {
      return response.employees;
    }

    return [];


  }

  getEmployeeName(employee: EmployeeModel): string {
    if (employee.name) {
      return employee.name;
    }


    const firstName = employee.firstName || '';
    const lastName = employee.lastName || '';

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || 'Unnamed Employee';


  }

  private updateClock(): void {
    const now = new Date();


    this.currentTime.set(
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    );

    this.currentDate.set(
      now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    );

    this.currentDay.set(
      now.toLocaleDateString('en-IN', {
        weekday: 'long'
      })
    );


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

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }
}
