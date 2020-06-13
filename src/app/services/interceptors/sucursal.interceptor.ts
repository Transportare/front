import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SucursalesService } from '@services/utils/sucursales.service';

@Injectable({
    providedIn: 'root',
})
export class SucursalInterceptor implements HttpInterceptor {
    constructor(private sucursalService: SucursalesService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sucursal = this.sucursalService.getSucursal();

        // evento en caso alguien elimine el id de la sucursal desde el local storage
        window.addEventListener('storage', (e: any) => {
            if (window.localStorage.getItem('sucursal') === null) {
                this.router.navigate(['/dashboard']);
            }
        });

        if (sucursal) {
            const newRequest = request.clone({
                setHeaders: {
                    Sucursal: `${sucursal}`,
                },
            });

            return next.handle(newRequest);
        } else {
            this.router.navigate(['/dashboard']);
            return next.handle(request);
        }
    }
}
