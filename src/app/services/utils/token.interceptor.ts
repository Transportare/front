import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '@services/login/login.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const data = this.loginService.getdataUser();

        if (data !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
        }

        // return next.handle(request).tap((event: HttpEvent<any>) => {
        //     if(event instanceof HttpResponse) {

        //     }
        // },(error:any ) =>  {
        //     if (error instanceof HttpErrorResponse) {
        //         if (error.status === 401 || error.status === 403) {
        //             console.log('Error en el token o validacion (401 - 403)');
        //             // this._router.navigate(['/login']);
        //         }
        //     }
        // })

        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        console.log(event);
                    }
                },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401 || error.status === 403) {
                            console.log('Error en el token o validacion (401 - 403)');
                            // this._router.navigate(['/login']);
                        }
                    }
                }
            )
        );
    }
}
