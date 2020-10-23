import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Manifiesto, PaginacionModel, Grupo } from '@models/index';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ManifiestoService {
    constructor(private http: HttpClient) {}

    getManifiestos(params): Observable<{ paginacion: PaginacionModel; manifiestos: Manifiesto[] }> {
        return this.http.get(`${API_URL}guias`, { params }).pipe(
            map((response: any) => {
                const manifiestoVacio = new Manifiesto();
                const paginacion: PaginacionModel = response.paginacion;
                const manifiestos = response.data.map(
                    (item): Manifiesto => ({
                        ...manifiestoVacio,
                        idGuia: item.IdGuia,
                        idPersonal: item.IdPersonal,
                        personal: item.Personal,
                        fechaSalida: item.FechaSalida,
                        fechaCierre: item.FechaCierre,
                        distrito: item.Distrito,
                        estado: item.Estado,
                    })
                );

                return { paginacion, manifiestos };
            })
        );
    }

    getOneManifiesto(id): Observable<Manifiesto> {
        return this.http.get(`${API_URL}guias/${id}`).pipe(
            map((response: any) => {
                const manifiestoVacio = new Manifiesto();
                return {
                    ...manifiestoVacio,
                    idGuia: response.data.IdGuia,
                    personal: response.data.Personal,
                    fechaSalida: response.data.FechaSalida,
                    sucursalDestino: response.data.SucursalDestino,
                    sucursalRemitente: response.data.SucursalRemite,
                    idEstado: response.data.IdEstadoGuia,
                    estado: response.data.Estado,
                };
            })
        );
    }

    getData(): Observable<{ choferes: Grupo[]; sucursales: Grupo[] }> {
        return new Observable((observer) => {
            this.http
                .get(`${API_URL}personales/byTipoPersonal/31`)
                .pipe(
                    map((response: any) => {
                        const choferes = response.data.map((item): Grupo => ({ id: item.IdPersonal, text: item.Nombres, grupo: '' }));
                        return choferes;
                    })
                )
                .subscribe((choferes) => {
                    this.http
                        .get(`${API_URL}sucursales`)
                        .pipe(
                            map((response: any) => {
                                const sucursales = response.data.map(
                                    (item): Grupo => ({ id: item.IdSucursal, text: item.Nombre, grupo: '' })
                                );
                                return sucursales;
                            })
                        )
                        .subscribe((sucursales) => {
                            observer.next({ choferes, sucursales });
                            observer.complete();
                        });
                });
        });
    }

    // postManifiesto(data) {
    //     return this.http.post(`${API_URL}guias`, data);
    // }

    postCargo(data) {
        return this.http.post(`${API_URL}cargos/temporal`, data);
    }

    getCargosUserTemp() {
        return this.http.get(`${API_URL}cargos/temporal/salida`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({ id: item.IdCargo, codigo: item.CodigoBarra, estado: item.EstadoCargo }));
            })
        );
    }

    getCargosByGuia(id) {
        return this.http.get(`${API_URL}cargos/${id}`).pipe(
            map((response: any) => {
                return response.data.map((item) => ({ id: item.IdCargo, codigo: item.CodigoBarra, estado: item.EstadoCargo }));
            })
        );
    }

    deleteCargo(id) {
        return this.http.delete(`${API_URL}cargos/${id}`);
    }

    postCargoDefinitivo(data) {
        return this.http.post(`${API_URL}cargos`, data);
    }

    postDescargoManifiesto(data) {
        return this.http.post(`${API_URL}cargos/descargos`, data);
    }

    generarPdfManifiesto(id) {
        return this.http.get(`${API_URL}guias/pdf/${id}`);
    }
}
