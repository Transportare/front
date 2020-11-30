import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DescargoMasivoService {
    constructor(private http: HttpClient) {}

    getCargosByGuia(id) {
        return this.http.get(`${API_URL}cargos/temporal/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({
                    id: item.IdCargo,
                    codigo: item.CodigoBarra,
                    estado: item.EstadoCargo,
                    detalleTexto: item.EstadoDetalle,
                    fechaVisita: item.FechaVisita,
                }));
            })
        );
    }

    postCargo(data) {
        return this.http.post(`${API_URL}cargos/temporal/descargo-masivo`, data);
    }

    deleteCargo(id) {
        return this.http.delete(`${API_URL}cargos/temporal/descargos/${id}`);
    }

    deleteByCodigo(codigoBarra) {
        return this.http.delete(`${API_URL}cargos/temporal/descargosByCodeBar/${codigoBarra}`);
    }

    postDescargoRegistrado() {
        return this.http.post(`${API_URL}cargos/descargo-masivo`, {});
    }
}
