import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Ubigeo, Manifiesto, Ruta, PaginacionModel, Grupo } from '@models/index';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DespachoService {
    constructor(private http: HttpClient) {}

    getCargosByGuia() {
        return this.http.get(`${API_URL}cargos/temporal/descargos`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({ id: item.IdCargo, codigo: item.CodigoBarra, estado: item.EstadoCargo }));
            })
        );
    }

    postCargo(data) {
        return this.http.post(`${API_URL}cargos/temporal/descargos`, data);
    }

    deleteCargo(id) {
        return this.http.delete(`${API_URL}cargos/temporal/descargos/${id}`);
    }

    deleteByCodigo(codigoBarra) {
        return this.http.delete(`${API_URL}cargos/temporal/descargosByCodeBar/${codigoBarra}`);
    }

    postDescargoRegistrado() {
        return this.http.post(`${API_URL}cargos/descargos`, {});
    }
}