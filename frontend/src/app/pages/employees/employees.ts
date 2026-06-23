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
  userRole = signal('USER');

  employees = signal<EmployeeModel[]>([]);
  filteredEmployees = signal<EmployeeModel[]>([]);
  paginatedEmployees = signal<EmployeeModel[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  searchText = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalElements = 0;

  sortBy = 'id';
  sortDir: 'asc' | 'desc' = 'desc';

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

    const role =
      window.localStorage.getItem('ems_user_role') || 'USER';

    this.userEmail.set(email);
    this.userRole.set(role.toUpperCase());

    this.loadEmployees();


  }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');


    const backendPage = this.currentPage - 1;

    this.employeeService.searchEmployees(
      this.searchText.trim(),
      backendPage,
      this.pageSize,
      this.sortBy,
      this.sortDir
    ).subscribe({
      next: (response: any) => {
        this.loading.set(false);

        const pageData = this.extractPageData(response);
        const employeeList = pageData.content;

        this.employees.set(employeeList);
        this.filteredEmployees.set(employeeList);
        this.paginatedEmployees.set(employeeList);

        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;

        if (this.totalPages < 1) {
          this.totalPages = 1;
        }

        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
          this.loadEmployees();
        }
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
            'Unable to load employees. Please check backend search API.'
          );
        }

        console.error('Employee Search API Error:', error);
      }
    });


  }

  private extractPageData(response: any): {
    content: EmployeeModel[];
    totalPages: number;
    totalElements: number;
  } {
    const data = response?.data || response;


    if (Array.isArray(data?.employees)) {
      return {
        content: data.employees,
        totalPages: Number(data.totalPages) || 1,
        totalElements:
          Number(data.totalItems) ||
          Number(data.totalElements) ||
          data.employees.length
      };
    }

    if (Array.isArray(data?.content)) {
      return {
        content: data.content,
        totalPages: Number(data.totalPages) || 1,
        totalElements:
          Number(data.totalElements) ||
          Number(data.totalItems) ||
          data.content.length
      };
    }

    if (Array.isArray(data?.data?.content)) {
      return {
        content: data.data.content,
        totalPages: Number(data.data.totalPages) || 1,
        totalElements:
          Number(data.data.totalElements) ||
          Number(data.data.totalItems) ||
          data.data.content.length
      };
    }

    if (Array.isArray(data)) {
      return {
        content: data,
        totalPages: 1,
        totalElements: data.length
      };
    }

    if (Array.isArray(response?.employees)) {
      return {
        content: response.employees,
        totalPages: 1,
        totalElements: response.employees.length
      };
    }

    return {
      content: [],
      totalPages: 1,
      totalElements: 0
    };


  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  applySearchAndPagination(): void {
    this.loadEmployees();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadEmployees();
  }

  toggleSortDirection(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.currentPage = 1;
    this.loadEmployees();
  }

  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
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

  getEmployeeMobile(employee: EmployeeModel): string {
    return employee.mobile || employee.phone || 'N/A';
  }

  getEmployeeStatus(employee: EmployeeModel): string {
    if (employee.status) {
      return employee.status;
    }


    if (employee.active !== undefined) {
      return employee.active ? 'ACTIVE' : 'INACTIVE';
    }

    if (employee.isActive !== undefined) {
      return employee.isActive ? 'ACTIVE' : 'INACTIVE';
    }

    return 'ACTIVE';


  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  addEmployee(): void {
    if (!this.isAdmin()) {
      this.showErrorAlert(
        'Access Denied',
        'Only ADMIN users can add employees.'
      );


      return;
    }

    this.router.navigate(['/add-employee']);


  }

  viewEmployee(employee: EmployeeModel): void {
    Swal.fire({
      icon: 'info',
      iconColor: '#2563eb',
      title: this.getEmployeeName(employee),
      html: `         <div style="text-align:left; line-height:1.8">           <b>Employee Code:</b> ${employee.employeeCode || 'N/A'}<br>           <b>Email:</b> ${employee.email || 'N/A'}<br>           <b>Mobile:</b> ${this.getEmployeeMobile(employee)}<br>           <b>Department:</b> ${employee.department || 'N/A'}<br>           <b>Salary:</b> ${employee.salary || 'N/A'}<br>           <b>Status:</b> ${this.getEmployeeStatus(employee)}<br>           <b>Joining Date:</b> ${employee.joiningDate || 'N/A'}         </div>
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
    if (!this.isAdmin()) {
      this.showErrorAlert(
        'Access Denied',
        'Only ADMIN users can edit employees.'
      );


      return;
    }

    if (!employee.id) {
      this.showErrorAlert(
        'Missing Employee ID',
        'Employee ID is missing. Unable to edit this employee.'
      );

      return;
    }

    this.router.navigate(['/edit-employee', employee.id]);


  }

  deleteEmployee(employee: EmployeeModel): void {
    if (!this.isAdmin()) {
      this.showErrorAlert(
        'Access Denied',
        'Only ADMIN users can delete employees.'
      );


      return;
    }

    if (!employee.id) {
      this.showErrorAlert(
        'Missing Employee ID',
        'Employee ID is missing. Unable to delete this employee.'
      );

      return;
    }

    Swal.fire({
      icon: 'warning',
      iconColor: '#ef4444',
      title: 'Delete Employee?',
      text: `Are you sure you want to delete ${this.getEmployeeName(employee)}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
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
      if (!result.isConfirmed || !employee.id) {
        return;
      }

      this.loading.set(true);

      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loading.set(false);

          Swal.fire({
            icon: 'success',
            iconColor: '#22c55e',
            title: 'Employee Deleted!',
            text: 'Employee has been deleted successfully.',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
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
            this.loadEmployees();
          });
        },

        error: (error: any) => {
          this.loading.set(false);

          console.error('Delete Employee Error:', error);

          if (error?.status === 401 || error?.status === 403) {
            this.showErrorAlert(
              'Access Denied',
              'Only ADMIN users can delete employees. Please login with an ADMIN account.'
            );

            return;
          }

          this.showErrorAlert(
            'Delete Failed',
            error?.error?.message ||
            'Unable to delete employee. Please check backend API.'
          );
        }
      });
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
          window.localStorage.removeItem('ems_user_role');
        }


        this.router.navigate(['/login']);
      }
    });


  }

  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      iconColor: '#ef4444',
      title,
      text: message,
      confirmButtonText: 'Okay',
      buttonsStyling: false,
      heightAuto: false,
      customClass: {
        container: 'ems-alert-container',
        popup: 'ems-alert-popup ems-alert-error',
        icon: 'ems-alert-icon',
        title: 'ems-alert-title',
        htmlContainer: 'ems-alert-message',
        confirmButton: 'ems-alert-button ems-alert-button-error'
      }
    });
  }
}
