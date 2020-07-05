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
import { Personal } from '@models/index';
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

    getPersonales(params): Observable<Personal[]> {
        return this.http.get(`${API_URL}personales`, { params }).pipe(
            map((response: any) => {
                const personalVacio = new Personal();
                return response.data.map((data) => {
                    const personal: Personal = {
                        ...personalVacio,
                        idPersonal: data.IdPersonal,
                        fecAsignacion: moment(data.FecAsignacion).format('DD/MM/YYYY'),
                        estado: data.Flag_Activo,
                        distrito: data.Ubigeo,
                        codigo: data.Codigo,
                        nombres: data.Nombres,
                        apellidos: data.Apellidos,
                        dni: data.DNI,
                        fecNacimiento: moment(data.FecNacimiento).format('DD/MM/YYYY'),
                        direccion: data.Direccion,
                        genero: data.Genero,
                        estadoCivil: data.EstadoCivil,
                        telefono: data.Telefono,
                        // fecIngreso: moment(data.FecIngreso).format('YYYY-MM-DD'),
                        fecIngreso: moment(data.FecIngreso).format('DD/MM/YYYY'),
                        tipoPersonal: data.TipoPersonal,
                    };

                    return personal;
                });
            })
        );
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
    }> {
        return this.http.get(`${API_URL}personales/${id}`).pipe(
            map((response: any) => {
                const personalVacio = new Personal();
                const personal: Personal = {
                    ...personalVacio,
                    idPersonal: response.personal.IdPersonal,
                    fecAsignacion: moment(response.personal.FecAsignacion).format('YYYY-MM-DD'),
                    estado: response.personal.Flag_Activo,
                    idUbigeo: response.personal.IdUbigeo,
                    idDepartamento: response.personal.IdDepartamento,
                    idProvincia: response.personal.IdProvincia,
                    codigo: response.personal.Codigo,
                    nombres: response.personal.Nombres,
                    apellidos: response.personal.Apellidos,
                    dni: response.personal.DNI,
                    fecNacimiento: moment(response.personal.FecNacimiento).format('YYYY-MM-DD'),
                    direccion: response.personal.Direccion,
                    idGenero: response.personal.IdGenero,
                    idEstadoCivil: response.personal.IdEstadoCivil,
                    telefono: response.personal.Telefono,
                    fecIngreso: moment(response.personal.FecIngreso).format('YYYY-MM-DD'),
                    idTipoPersonal: response.personal.IdTipoPersonal,
                    sucursales: response.personal.sucursales,
                };

                const generos: Grupo[] = response.genero.map((genero) => ({
                    id: genero.IdTablaGeneral,
                    text: genero.Descripcion,
                    grupo: genero.Grupo,
                }));
                const estadosCiviles: Grupo[] = response.estadoCivil.map((estado) => ({
                    id: estado.IdTablaGeneral,
                    text: estado.Descripcion,
                    grupo: estado.Grupo,
                }));
                const tipoPersonales: Grupo[] = response.tipoPersonal.map((tipo) => ({
                    id: tipo.IdTablaGeneral,
                    text: tipo.Descripcion,
                    grupo: tipo.Grupo,
                }));
                const departamentos = response.departamento.map((departamento) => ({
                    id: departamento.IdUbigeo,
                    text: departamento.Descripcion,
                    padre: departamento.Padre,
                }));
                const provincias = response.provincia.map((provincia) => ({
                    id: provincia.IdUbigeo,
                    text: provincia.Descripcion,
                    padre: provincia.Padre,
                }));
                const distritos = response.distrito.map((distrito) => ({
                    id: distrito.IdUbigeo,
                    text: distrito.Descripcion,
                    padre: distrito.Padre,
                }));

                return { personal, generos, estadosCiviles, tipoPersonales, departamentos, provincias, distritos };
            })
        );
    }

    getSelectsDePersonales(): Observable<{
        generos: Grupo[];
        estadosCiviles: Grupo[];
        tipoPersonales: Grupo[];
        departamentos: Ubigeo[];
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

    postPersonal(data) {
        return this.http.post(`${API_URL}personales`, data);
    }

    putPersonal(id, data) {
        return this.http.put(`${API_URL}personales/${id}`, data);
    }

    deletePersonal(id) {
        return this.http.delete(`${API_URL}personales/${id}`);
    }
}
