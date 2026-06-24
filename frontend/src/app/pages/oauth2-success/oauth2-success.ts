import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oauth2-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        padding: 32px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
        text-align: center;
        width: 360px;
      ">
        <h2 style="margin-bottom: 10px;">Google Login</h2>
        <p style="color: #64748b;">Please wait, EMS is signing you in...</p>
      </div>
    </div>
  `
})
export class OAuth2Success implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    const role = this.route.snapshot.queryParamMap.get('role');

    if (!token || !email || !role) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Token, email, or role missing from Google login response.',
        confirmButtonText: 'Back to Login',
        heightAuto: false
      }).then(() => {
        this.router.navigate(['/login']);
      });

      return;
    }

    window.localStorage.setItem('ems_token', token);
    window.localStorage.setItem('ems_user_email', email);
    window.localStorage.setItem('ems_user_role', role.toUpperCase());

    Swal.fire({
      icon: 'success',
      title: 'Google Login Successful!',
      text: 'Redirecting to dashboard...',
      timer: 1400,
      timerProgressBar: true,
      showConfirmButton: false,
      heightAuto: false
    }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
