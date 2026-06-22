import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApiLoader } from '../../core/services/api-loader';

@Component({
    selector: 'app-api-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
<div class="api-loader-backdrop" *ngIf="apiLoader.isLoading()"> <div class="api-loader-card"> <div class="api-loader-spinner"></div>


    <h3>Please wait...</h3>
    <p>API response is loading</p>
  </div>
</div>


`,
    styles: [`
.api-loader-backdrop {
position: fixed;
inset: 0;
z-index: 99999;
display: flex;
align-items: center;
justify-content: center;
background: rgba(15, 23, 42, 0.55);
backdrop-filter: blur(6px);
}


.api-loader-card {
  width: 280px;
  padding: 34px 28px;
  border-radius: 28px;
  text-align: center;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.api-loader-spinner {
  width: 58px;
  height: 58px;
  margin: 0 auto 18px;
  border-radius: 50%;
  border: 6px solid #dbeafe;
  border-top-color: #2563eb;
  animation: apiLoaderSpin 0.8s linear infinite;
}

.api-loader-card h3 {
  margin: 0;
  color: #0f172a;
  font-size: 25px;
  font-weight: 950;
}

.api-loader-card p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 16px;
  font-weight: 700;
}

@keyframes apiLoaderSpin {
  to {
    transform: rotate(360deg);
  }
}


`]
})
export class ApiLoaderComponent {
    constructor(public apiLoader: ApiLoader) { }
}
