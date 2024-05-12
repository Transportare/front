import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CargaDatosService {
    constructor(private http: HttpClient) {}

    postCargarDatos(data) {
        return this.http.post(`${API_URL}clienteConsignado/upload`, data);
    }

    postCargarDatosSimple(data) {
        return this.http.post(`${API_URL}clienteConsignado/importarExcel`, data);
    }

    getOrdenServicio(id) {
        return this.http.get(`${API_URL}clienteConsignado/byOrden/${id}`).pipe(
            map((response: any) => {
                const nombres = response.data.nombres?.split(' - ') || '';

                return {
                    ...response.data,
                    cliente: nombres[0],
                    servicio: nombres[1],
                };
            })
        );
    }
}
