import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UbigeoService {
    constructor(private http: HttpClient) {}

    getDepartamentos() {
        return this.http.get(`${API_URL}ubigeos`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({
                    id: item.IdUbigeo,
                    text: item.Descripcion,
                    padre: item.Padre,
                }));
            })
        );
    }

    getHijos(id: number) {
        return this.http.get(`${API_URL}ubigeos/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({
                    id: item.IdUbigeo,
                    text: item.Descripcion,
                    padre: item.Padre,
                }));
            })
        );
    }
}
