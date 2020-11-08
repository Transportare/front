import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grupo } from '@models/index';

@Injectable({ providedIn: 'root' })
export class DescargoRutaService {
    constructor(private http: HttpClient) {}

    // getMensajero(): Observable<{ mensajeros: Grupo[] }> {
    getMensajero(): Observable<Grupo[]> {
        return this.http.get(`${API_URL}personales/byTipoPersonal/32`).pipe(
            map((response: any) => {
                const mensajeros = response.data.map(
                    (item): Grupo => ({
                        id: item.IdPersonal,
                        text: `${item.Codigo} - ${item.Nombres}`,
                        grupo: '',
                    })
                );

                return mensajeros;
            })
        );
    }
}
