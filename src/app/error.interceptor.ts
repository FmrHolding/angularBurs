import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorIntercept implements HttpInterceptor {

    constructor(
        private router: Router,
        private toastr: ToastrService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 0) {
                        this.toastr.error('Servis kapalı', '----- UYARI -----', { timeOut: 1000 });
                    } else if (err.status === 401) {
                        this.router.navigate(['/login']);
                    } else if (err.status === 403) {
                        this.router.navigate(["portal/notpage"], {
                            queryParams: {
                                status: err.status,
                                error: err.error
                            }
                        });
                    } else if (err.status === 500) {
                        this.toastr.warning('Talep Edilen İstek Karşılanamadı.', '----- UYARI -----', { timeOut: 2000 });
                    }
                    return throwError(() => new Error(err.error));
                })
            );
    }
}
