import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { Grupo } from '@models/grupo';
import { map } from 'rxjs/operators';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Ubigeo } from '@models/ubigeo';

@Injectable({
    providedIn: 'root',
})
export class PersonalService {
    constructor(private http: HttpClient, private tablaGeneral: TablaGeneralService, private ubigeoService: UbigeoService) {}

    getPersonales(params) {
        return this.http.get(`${API_URL}personales`, { params });
    }

    getSelectsDePersonales(): Observable<{ generos: Grupo[]; estadosCiviles: Grupo[]; tipoPersonales: Grupo[]; departamentos: Ubigeo[] }> {
        return new Observable((observer) => {
            this.tablaGeneral
                .getSelectPorGrupo(1)
                .pipe(
                    map((response: Grupo[]) => {
                        const generos = response;
                        return generos;
                    })
                )
                .subscribe((generos: Grupo[]) => {
                    this.tablaGeneral
                        .getSelectPorGrupo(2)
                        .pipe(
                            map((response: Grupo[]) => {
                                const estadosCiviles = response;
                                return estadosCiviles;
                            })
                        )
                        .subscribe((estadosCiviles: Grupo[]) => {
                            this.tablaGeneral
                                .getSelectPorGrupo(3)
                                .pipe(
                                    map((response: Grupo[]) => {
                                        const tipoPersonales = response;
                                        return tipoPersonales;
                                    })
                                )
                                .subscribe((tipoPersonales: Grupo[]) => {
                                    this.ubigeoService
                                        .getDepartamentos()
                                        .pipe(
                                            map((response: Ubigeo[]) => {
                                                const departamentos = response;
                                                return departamentos;
                                            })
                                        )
                                        .subscribe((departamentos) => {
                                            observer.next({
                                                generos,
                                                estadosCiviles,
                                                tipoPersonales,
                                                departamentos,
                                            });
                                            observer.complete();
                                        });
                                });
                        });
                });
        });
    }
}
