import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { LoginService } from '@services/login/login.service';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SucursalesService {
    private sucursalStorage = new Subject<number>();

    constructor(private http: HttpClient, private loginService: LoginService) {}

    getSucursales(): Observable<any> {
        return new Observable((observer) => {
            const data = this.loginService.getdataUser();
            if (data) {
                const response = JSON.parse(atob(data.token.split('.')[1]));
                observer.next(response.usuarioToken.sucursales);
            }
            observer.complete();
        }).pipe(
            map((response: any) => {
                // console.log(response);
                return response.map((sucursal: any) => {
                    return { id: sucursal.IdSucursal, text: sucursal.Nombre };
                });
            })
        );
    }

    changeSucursal(): Observable<any> {
        return this.sucursalStorage.asObservable();
    }

    sucursalElegida(id: number) {
        localStorage.setItem('sucursal', id.toString());
        this.sucursalStorage.next(id);
    }

    getSucursal() {
        return localStorage.getItem('sucursal');
    }
}
