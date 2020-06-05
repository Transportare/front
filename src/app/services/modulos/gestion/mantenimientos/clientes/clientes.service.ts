import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    constructor(private http: HttpClient) {}

    getClientes() {
        return this.http.get(`${API_URL}clientes`);
    }
}
