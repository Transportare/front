import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grupo } from '@models/index';

@Injectable({ providedIn: 'root' })
export class TablaGeneralService {
    constructor(private http: HttpClient) {}

    getSelectPorGrupo(id: number): Observable<Grupo[]> {
        return this.http.get(`${API_URL}tablaGeneral/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({
                    id: item.IdTablaGeneral,
                    text: item.Descripcion,
                    grupo: item.Grupo,
                    grupoDes: item.GrupoDes,
                }));
            })
        );
    }
}
