import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { Grupo, PaginacionModel, Servicio } from '@models/index';

@Injectable({
    providedIn: 'root',
})
export class ServiciosService {
    constructor(private http: HttpClient, private tablaGeneralService: TablaGeneralService) {}

    getServicios(params): Observable<{ servicios: Servicio[]; paginacion: PaginacionModel }> {
        return this.http.get(`${API_URL}servicios`, { params }).pipe(
            map((response: any) => {
                const paginacion: PaginacionModel = response.paginacion;
                const servicios: Servicio[] = response.data.map((servicio) => ({
                    idServicio: servicio.IdServicio,
                    idCliente: servicio.IdCliente,
                    cliente: servicio.Cliente,
                    idTipoServicio: servicio.IdTipoServicio,
                    tipoServicio: servicio.TipoServicio,
                    nombre: servicio.Nombre,
                    tiempo: servicio.Tiempo,
                    observacion: servicio.Observacion,
                }));

                return { servicios, paginacion };
            })
        );
    }

    getOneServicio(idServicio, params): Observable<{ servicio: Servicio; sucursales: Grupo[]; tipoServicios: Grupo[]; clientes: Grupo[] }> {
        return this.http.get(`${API_URL}servicios/${idServicio}`, { params }).pipe(
            map((response: any) => {
                const servicio: Servicio = {
                    ...new Servicio(),
                    idServicio: response.servicio.IdServicio,
                    idCliente: response.servicio.IdCliente,
                    idTipoServicio: response.servicio.IdTipoServicio,
                    nombre: response.servicio.Nombre,
                    tiempo: response.servicio.Tiempo,
                    observacion: response.servicio.Observacion,
                    estado: response.servicio.Flag_Activo,
                    sucursales: response.servicio.sucursales,
                };

                const sucursales: Grupo[] = response.sucursales.map(
                    (sucursal): Grupo => {
                        return {
                            id: sucursal.IdSucursal,
                            text: sucursal.Nombre,
                            grupo: '',
                        };
                    }
                );

                const tipoServicios: Grupo[] = response.tipoServicio.map(
                    (tipo): Grupo => {
                        return {
                            id: tipo.IdTablaGeneral,
                            text: tipo.Descripcion,
                            grupo: tipo.GrupoDes,
                        };
                    }
                );

                const clientes: Grupo[] = response.clientes.map(
                    (tipo): Grupo => {
                        return {
                            id: tipo.IdCliente,
                            text: tipo.Nombre,
                            grupo: '',
                        };
                    }
                );

                return { servicio, sucursales, tipoServicios, clientes };
            })
        );
    }

    listarSelects(): Observable<{ tipoServicios: Grupo[]; clientes: Grupo[] }> {
        return new Observable((observer) => {
            this.tablaGeneralService
                .getSelectPorGrupo(7)
                .pipe(
                    map((response: any) => {
                        const tipoServicios: Grupo[] = response;

                        return tipoServicios;
                    })
                )
                .subscribe((tipoServicios) => {
                    this.http
                        .get(`${API_URL}clientes/by/sucursal`)
                        .pipe(
                            map((response: any) => {
                                const clientes: Grupo[] = response.data.map((item) => ({
                                    id: item.IdCliente,
                                    text: item.Nombre,
                                    grupo: '',
                                }));

                                return clientes;
                            })
                        )
                        .subscribe((clientes) => {
                            observer.next({ tipoServicios, clientes });
                            observer.complete();
                        });
                });
        });
    }

    getSucursalesByCliente(params) {
        return this.http.get(`${API_URL}clientes/sucursales/servicios`, { params }).pipe(
            map((response: any) => {
                return response.data.map((sucursal) => ({
                    id: sucursal.IdSucursal,
                    text: sucursal.Nombre,
                }));
            })
        );
    }

    postServicio(data: Servicio) {
        return this.http.post(`${API_URL}servicios`, data);
    }

    putServicio(id, data: Servicio) {
        return this.http.put(`${API_URL}servicios/${id}`, data);
    }
}
