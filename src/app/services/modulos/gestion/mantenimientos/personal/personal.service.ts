import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { Grupo } from '@models/grupo';
import { map } from 'rxjs/operators';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Ubigeo } from '@models/ubigeo';
import { SucursalesService } from '@services/utils/sucursales.service';
import { Personal } from '@models/personal';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class PersonalService {
    constructor(
        private http: HttpClient,
        private tablaGeneral: TablaGeneralService,
        private ubigeoService: UbigeoService,
        private sucursalesService: SucursalesService
    ) {}

    getPersonales(params) {
        return this.http.get(`${API_URL}personales`, { params });
    }

    getOnePersonal(
        id
    ): Observable<{
        personal: Personal;
        generos: Grupo[];
        estadosCiviles: Grupo[];
        tipoPersonales: Grupo[];
        departamentos: Ubigeo[];
        provincias: Ubigeo[];
        distritos: Ubigeo[];
        sucursales: any[];
    }> {
        return new Observable((observer) => {
            this.http
                .get(`${API_URL}personales/${id}`)
                .pipe(
                    map((response: any) => {
                        const personal: Personal = {
                            idPersonal: response.data.IdPersonal,
                            fecAsignacion: moment(response.data.FecAsignacion).format('YYYY-MM-DD'),
                            estado: response.data.Flag_Activo,
                            idUbigeo: response.data.IdUbigeo,
                            idDepartamento: response.data.IdDepartamento,
                            idProvincia: response.data.IdProvincia,
                            codigo: response.data.Codigo,
                            nombres: response.data.Nombres,
                            apellidos: response.data.Apellidos,
                            dni: response.data.DNI,
                            fecNacimiento: moment(response.data.FecNacimiento).format('YYYY-MM-DD'),
                            direccion: response.data.Direccion,
                            idGenero: response.data.IdGenero,
                            idEstadoCivil: response.data.IdEstadoCivil,
                            telefono: response.data.Telefono,
                            fecIngreso: moment(response.data.FecIngreso).format('YYYY-MM-DD'),
                            idTipoPersonal: response.data.IdTipoPersonal,
                            sucursales: response.data.sucursales,
                        };

                        return personal;
                    })
                )
                .subscribe((personal: Personal) => {
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
                                                    this.sucursalesService
                                                        .getSucursales()
                                                        .pipe(
                                                            map((response: any[]) => {
                                                                const sucursales = response;
                                                                return sucursales;
                                                            })
                                                        )
                                                        .subscribe((sucursales: any[]) => {
                                                            this.ubigeoService
                                                                .getHijos(Number(personal.idDepartamento))
                                                                .pipe(
                                                                    map((response: Ubigeo[]) => {
                                                                        const provincias = response;
                                                                        return provincias;
                                                                    })
                                                                )
                                                                .subscribe((provincias: any[]) => {
                                                                    this.ubigeoService
                                                                        .getHijos(Number(personal.idProvincia))
                                                                        .pipe(
                                                                            map((response: Ubigeo[]) => {
                                                                                const distritos = response;
                                                                                return distritos;
                                                                            })
                                                                        )
                                                                        .subscribe((distritos) => {
                                                                            observer.next({
                                                                                personal,
                                                                                generos,
                                                                                estadosCiviles,
                                                                                tipoPersonales,
                                                                                departamentos,
                                                                                sucursales,
                                                                                distritos,
                                                                                provincias,
                                                                            });
                                                                            observer.complete();
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
    }

    getSelectsDePersonales(): Observable<{
        generos: Grupo[];
        estadosCiviles: Grupo[];
        tipoPersonales: Grupo[];
        departamentos: Ubigeo[];
        sucursales: any[];
    }> {
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
                                            this.sucursalesService
                                                .getSucursales()
                                                .pipe(
                                                    map((response: any[]) => {
                                                        const sucursales = response;
                                                        return sucursales;
                                                    })
                                                )
                                                .subscribe((sucursales) => {
                                                    observer.next({
                                                        generos,
                                                        estadosCiviles,
                                                        tipoPersonales,
                                                        departamentos,
                                                        sucursales,
                                                    });
                                                    observer.complete();
                                                });
                                        });
                                });
                        });
                });
        });
    }

    postPersonal(data) {
        return this.http.post(`${API_URL}personales`, data);
    }
}
