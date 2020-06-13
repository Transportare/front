import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    constructor(private http: HttpClient) {}

    getClientes() {
        return this.http.get(`${API_URL}clientes`);
    }

    getUnCliente(id: number) {
        return this.http.get(`${API_URL}clientes/${id}`).pipe(map((response: any) => response.data));
    }

    postClientes(data) {
        return this.http.post(`${API_URL}clientes`, data);
    }

    putCliente(id, data) {
        return this.http.put(`${API_URL}clientes/${id}`, data);
    }
}
