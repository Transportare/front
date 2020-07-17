import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';

@Injectable({
    providedIn: 'root',
})
export class CargaDatosService {
    constructor(private http: HttpClient) {}

    postCargarDatos(data: File) {
        const formData = new FormData();
        formData.append('archivo', data);

        return this.http.post(`${API_URL}clienteConsignado/upload`, data);
    }
}
