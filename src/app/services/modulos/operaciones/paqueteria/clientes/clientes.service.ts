import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Seguimiento, PaginacionModel } from '@models/index';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ClientePaqueteriaService {
    constructor(private http: HttpClient) {}

    // postConsultasCargo(data: { codigoBarra: string[] }): Observable<{ seguimientos: Seguimiento[] }> {
    //     return this.http.post(`${API_URL}cargos/consulta`, data).pipe(
    // map((response: any) => {
    //     const seguimientos: Seguimiento[] = response.data.map(
    //         (item): Seguimiento => ({
    //             ...new Seguimiento(),
    //             idOrdenServicio: item.IdOrdenServicio,
    //             codigoBarra: item.CodigoBarra,
    //             destinatario: item.Destinatario,
    //             direccionDestino: item.DireccionDestino,
    //             fechaSalida: item.FechaSalida ? moment(item.FechaSalida).format('DD/MM/YYYY') : '-',
    //             fechaDescargo: item.FechaDescargo ? moment(item.FechaDescargo).format('DD/MM/YYYY') : '-',
    //             fechaVisita: item.FechaVisita ? moment(item.FechaVisita).format('DD/MM/YYYY') : '-',
    //             estado: item.Estado,
    //             estadoDetalle: item.EstadoDetalle,
    //             sucursalDestino: item.SucursalDestino,
    //             sucursalRemite: item.SucursalRemite,
    //         })
    //     );

    //             return { seguimientos };
    //         })
    //     );
    // }

    getConsultaCliente(
        id,
        params: { filas: string; pagina: string }
    ): Observable<{ cargos: Seguimiento[]; paginacion: PaginacionModel; cliente: { nombres: string; ruc: string } }> {
        return this.http.get(`${API_URL}cargos/consulta/${id}`, { params }).pipe(
            map((response: any) => {
                const cliente = response.data.cliente;
                const paginacion: PaginacionModel = response.paginacion;
                const cargos: Seguimiento[] = response.data.cargos.map(
                    (item): Seguimiento => ({
                        ...new Seguimiento(),
                        idOrdenServicio: item.IdOrdenServicio,
                        codigoBarra: item.CodigoBarra,
                        destinatario: item.Destinatario,
                        direccionDestino: item.DireccionDestino,
                        fechaSalida: item.FechaSalida ? moment(item.FechaSalida).format('DD/MM/YYYY') : '-',
                        fechaDescargo: item.FechaDescargo ? moment(item.FechaDescargo).format('DD/MM/YYYY') : '-',
                        fechaVisita: item.FechaVisita ? moment(item.FechaVisita).format('DD/MM/YYYY') : '-',
                        estado: item.Estado,
                        estadoDetalle: item.EstadoDetalle,
                        sucursalDestino: item.SucursalDestino,
                        sucursalRemite: item.SucursalRemite,
                    })
                );

                return { cargos, paginacion, cliente };
            })
        );
    }
}
