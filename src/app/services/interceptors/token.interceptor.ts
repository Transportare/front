import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '@services/login/login.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const data = this.loginService.getdataUser();

        if (data !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
        }

        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {},
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401 || error.status === 403) {
                            this.loginService.logOut();
                            this.router.navigate(['/login']);
                        }
                    }
                }
            )
        );
    }
}
