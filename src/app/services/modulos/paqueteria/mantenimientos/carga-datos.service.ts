import { Injectable } from '@angular/core';
import { API_URL } from 'config/api.route';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '@models/index';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CargaDatosService {
    constructor(private http: HttpClient) {}

    getClientes() {
        return this.http.get(`${API_URL}clientes/by/sucursal`).pipe(
            map((response: any) => {
                const clientes: Grupo[] = response.data.map((item) => ({
                    id: item.IdCliente,
                    text: item.Nombre,
                    grupo: '',
                }));

                return clientes;
            })
        );
    }

    postCargaDatos(data) {
        return this.http.post(`${API_URL}rutas/importar`, data);
    }
}
