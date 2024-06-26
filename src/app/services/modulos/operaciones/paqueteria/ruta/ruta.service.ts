import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Ubigeo, Ruta, PaginacionModel, Cargo } from '@models/index';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class RutaService {
    constructor(private http: HttpClient) {}

    postRuta(data) {
        return this.http.post(`${API_URL}rutas`, data);
    }

    getRutas(params): Observable<{ rutas: Ruta[]; paginacion: PaginacionModel }> {
        return this.http.get(`${API_URL}rutas`, { params }).pipe(
            map((response: any) => {
                const paginacion: PaginacionModel = response.paginacion;
                const rutas: Ruta[] = response.data.map((item) => {
                    const ruta: Ruta = {
                        ...new Ruta(),
                        idOrdenServicio: item.IdOrdenServicio,
                        idServicio: item.IdServicio,
                        idSucursal: item.IdSucursal,
                        idCliente: item.IdCliente,
                        guiaOs: item.GuiaOs,
                        nombreCliente: item.NombreCliente,
                        ruc: item.RUC,
                        cantidadPaquetes: item.CantidadPaquetes,
                        pesoTotal: item.PesoTotal,
                        fechaRegistro: moment(item.FechaRegistro).format('DD/MM/YYYY'),
                        envio: item.Envio,
                        destino: item.Destino,
                    };

                    return ruta;
                });

                return { rutas, paginacion };
            })
        );
    }

    getOneRuta(id): Observable<Cargo> {
        return this.http.get(`${API_URL}rutas/${id}`).pipe(
            map(
                (response: any): Cargo => {
                    const tracking = {
                        codigoBarra: response.data.tracking.CodigoBarra,
                        estadoCargo: response.data.tracking.EstadoCargo,
                        fechaArriboDestino: response.data.tracking.FechaArriboDestino,
                        fechaDescargo: response.data.tracking.FechaDescargo,
                        fechaDespachoDestino: response.data.tracking.FechaDespachoDestino,
                        fechaSalida: response.data.tracking.FechaSalida,
                        fechaVisita: response.data.tracking.FechaVisita,
                        idCargo: response.data.tracking.IdCargo,
                        idCliente: response.data.tracking.IdCliente,
                        idEstadoCargo: response.data.tracking.IdEstadoCargo,
                        idOrdenServicio: response.data.tracking.IdOrdenServicio,
                        idServicio: response.data.tracking.IdServicio,
                    };

                    return { ...response.data, tracking };
                }
            )
        );
    }

    getDistrito(id): Observable<Ubigeo[]> {
        return this.http.get(`${API_URL}ubigeos/bySucursal/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item): Ubigeo => ({ id: item.IdUbigeo, text: item.Descripcion, padre: '' }));
            })
        );
    }

    getClientesDni(dni) {
        return this.http.get(`${API_URL}clientes/dni/${dni}`);
    }
}
