import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grupo, OrdenServicio, PaginacionModel } from '@models/index';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class OrdenServicioService {
    constructor(private http: HttpClient) {}

    getOrdenServicios(params): Observable<{ ordenes: OrdenServicio[]; paginacion: PaginacionModel }> {
        return this.http.get(`${API_URL}ordenServicio`, { params }).pipe(
            map((response: any) => {
                const paginacion: PaginacionModel = response.paginacion;

                const ordenes: OrdenServicio[] = response.data.map(
                    (item): OrdenServicio => {
                        return {
                            idOrdenServicio: item.IdOrdenServicio,
                            idServicio: item.IdServicio,
                            servicio: item.Servicio,
                            idSucursal: item.IdSucursal,
                            sucursal: item.Sucursal,
                            idCliente: item.IdCliente,
                            cliente: item.Cliente,
                            fecCreacion: item.FecCreacion ? moment(item.FecCreacion).format('DD/MM/YYYY') : '',
                            inicioDist: item.InicioDist,
                            observaciones: item.Observaciones,
                        };
                    }
                );

                return { paginacion, ordenes };
            })
        );
    }

    getClientes(): Observable<Grupo[]> {
        return this.http.get(`${API_URL}clientes/by/sucursal`).pipe(
            map((response: any) => {
                return response.data.map(
                    (item): Grupo => {
                        return {
                            id: item.IdCliente,
                            text: item.Nombre,
                            grupo: '',
                        };
                    }
                );
            })
        );
    }

    getServiciosClientes(id): Observable<Grupo[]> {
        return this.http.get(`${API_URL}servicios/byCliente/${id}`).pipe(
            map((response: any) => {
                return response.data.map(
                    (item): Grupo => {
                        return {
                            id: item.IdServicio,
                            text: item.Servicio,
                            grupo: '',
                        };
                    }
                );
            })
        );
    }

    postOrdenServicio(data) {
        return this.http.post(`${API_URL}ordenServicio`, data);
    }
}
