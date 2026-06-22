import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { ApiLoader } from '../services/api-loader';

export const apiLoaderInterceptor: HttpInterceptorFn = (request, next) => {
    const apiLoader = inject(ApiLoader);

    apiLoader.show();

    return next(request).pipe(
        finalize(() => {
            apiLoader.hide();
        })
    );
};
