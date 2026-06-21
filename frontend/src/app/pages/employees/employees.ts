import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  Employee,
  EmployeeModel
} from '../../core/services/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {
  userEmail = signal('[admin@ems.com](mailto:admin@ems.com)');

  employees = signal<EmployeeModel[]>([]);
  filteredEmployees = signal<EmployeeModel[]>([]);
  paginatedEmployees = signal<EmployeeModel[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  searchText = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private employeeService: Employee,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

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

    this.loadEmployees();


  }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');


    this.employeeService.getAllEmployees().subscribe({
      next: (response: any) => {
        this.loading.set(false);

        const employeeList = this.extractEmployees(response);

        this.employees.set(employeeList);
        this.applySearchAndPagination();
      },

      error: (error: any) => {
        this.loading.set(false);

        if (error?.status === 401 || error?.status === 403) {
          this.errorMessage.set(
            'Access denied. Please logout and login again with a valid ADMIN or USER account.'
          );
        } else {
          this.errorMessage.set(
            error?.error?.message ||
            'Unable to load employees. Please check backend API.'
          );
        }

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

  onSearchChange(): void {
    this.currentPage = 1;
    this.applySearchAndPagination();
  }

  applySearchAndPagination(): void {
    const query = this.searchText.trim().toLowerCase();


    const filtered = this.employees().filter((employee) => {
      const name = this.getEmployeeName(employee).toLowerCase();
      const email = (employee.email || '').toLowerCase();
      const department = (employee.department || '').toLowerCase();
      const designation = (employee.designation || '').toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        department.includes(query) ||
        designation.includes(query)
      );
    });

    this.filteredEmployees.set(filtered);

    this.totalPages = Math.max(
      1,
      Math.ceil(filtered.length / this.pageSize)
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedEmployees.set(filtered.slice(startIndex, endIndex));


  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applySearchAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applySearchAndPagination();
    }
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

  getEmployeeStatus(employee: EmployeeModel): string {
    if (employee.active !== undefined) {
      return employee.active ? 'Active' : 'Inactive';
    }


    if (employee.isActive !== undefined) {
      return employee.isActive ? 'Active' : 'Inactive';
    }

    return 'Active';


  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  addEmployee(): void {
    this.router.navigate(['/add-employee']);
  }

  viewEmployee(employee: EmployeeModel): void {
    Swal.fire({
      icon: 'info',
      iconColor: '#2563eb',
      title: this.getEmployeeName(employee),
      html: `         <div style="text-align:left; line-height:1.8">           <b>Email:</b> ${employee.email || 'N/A'}<br>           <b>Phone:</b> ${employee.phone || 'N/A'}<br>           <b>Department:</b> ${employee.department || 'N/A'}<br>           <b>Designation:</b> ${employee.designation || 'Employee'}<br>           <b>Status:</b> ${this.getEmployeeStatus(employee)}         </div>
      `,
      confirmButtonText: 'Close',
      buttonsStyling: false,
      heightAuto: false,
      customClass: {
        container: 'ems-alert-container',
        popup: 'ems-alert-popup ems-alert-success',
        icon: 'ems-alert-icon',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: 'ems-alert-button ems-alert-button-success'
      }
    });
  }

  editEmployee(employee: EmployeeModel): void {
    Swal.fire({
      icon: 'info',
      iconColor: '#f59e0b',
      title: 'Edit Employee',
      text: `${this.getEmployeeName(employee)} edit form will be implemented next.`,
      confirmButtonText: 'Okay',
      buttonsStyling: false,
      heightAuto: false,
      customClass: {
        container: 'ems-alert-container',
        popup: 'ems-alert-popup ems-alert-warning',
        icon: 'ems-alert-icon',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: 'ems-alert-button ems-alert-button-warning'
      }
    });
  }

  deleteEmployee(employee: EmployeeModel): void {
    Swal.fire({
      icon: 'warning',
      iconColor: '#ef4444',
      title: 'Delete Employee?',
      text: `Are you sure you want to delete ${this.getEmployeeName(employee)}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
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
    });
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
}
