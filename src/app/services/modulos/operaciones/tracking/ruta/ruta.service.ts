import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';

@Injectable({ providedIn: 'root' })
export class RutaService {
    constructor(private http: HttpClient) {}

    postRuta(data) {
        return this.http.post(`${API_URL}rutas`, data);
    }
}
