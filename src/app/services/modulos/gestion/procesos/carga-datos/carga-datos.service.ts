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

    getOrdenServicio(id) {
        return this.http.get(`${API_URL}clienteConsignado/byOrden/${id}`).pipe(
            map((response: any) => {
                const data = response.data;
                return {
                    data: data.Data,
                    mensaje: data.Mensaje,
                    succes: data.Succes === 'True' ? true : false,
                };
            })
        );
    }
}
