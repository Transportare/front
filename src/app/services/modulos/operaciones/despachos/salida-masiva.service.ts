import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grupo } from '@models/index';

@Injectable({ providedIn: 'root' })
export class SalidaMasivaService {
    constructor(private http: HttpClient) {}

    getCargosUserTemp(idDescargo: number) {
        return this.http.get(`${API_URL}cargos/temporal/${idDescargo}`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({ id: item.IdCargo, codigo: item.CodigoBarra, estado: item.EstadoCargo }));
            })
        );
    }

    getMensajero(): Observable<Grupo[]> {
        return this.http.get(`${API_URL}personales/byTipoPersonal/32`).pipe(
            map((response: any) => {
                const mensajeros = response.data.map(
                    (item): Grupo => ({
                        id: item.IdPersonal,
                        text: `${item.Codigo} - ${item.Nombres}`,
                        grupo: '',
                    })
                );

                return mensajeros;
            })
        );
    }

    postSalidaMasiva(data) {
        return this.http.post(`${API_URL}cargos/salida-masiva`, data);
    }

    postSalidaMasivaTemporal(codigo) {
        return this.http.post(`${API_URL}cargos/temporal/salida-masiva`, codigo);
    }

    deleteCargo(id) {
        return this.http.delete(`${API_URL}cargos/temporal/descargos/${id}`);
    }

    deleteByCodigo(codigoBarra) {
        return this.http.delete(`${API_URL}cargos/temporal/descargosByCodeBar/${codigoBarra}`);
    }
}
