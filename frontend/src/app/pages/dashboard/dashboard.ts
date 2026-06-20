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

  private clockInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
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
    }


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
