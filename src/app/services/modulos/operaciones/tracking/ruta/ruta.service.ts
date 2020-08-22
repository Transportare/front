import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Ubigeo, Ruta, PaginacionModel } from '@models/index';
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
                    };

                    return ruta;
                });

                return { rutas, paginacion };
            })
        );
    }

    getDistrito(id): Observable<Ubigeo[]> {
        return this.http.get(`${API_URL}ubigeos/bySucursal/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item): Ubigeo => ({ id: item.IdUbigeo, text: item.Descripcion, padre: '' }));
            })
        );
    }
}
