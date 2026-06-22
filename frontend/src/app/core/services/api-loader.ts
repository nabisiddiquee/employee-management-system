import { Injectable, signal } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class ApiLoader {
private requestCount = 0;

isLoading = signal(false);

show(): void {
this.requestCount++;
this.isLoading.set(true);
}

hide(): void {
if (this.requestCount > 0) {
this.requestCount--;
}


if (this.requestCount === 0) {
  this.isLoading.set(false);
}


}

reset(): void {
this.requestCount = 0;
this.isLoading.set(false);
}
}
