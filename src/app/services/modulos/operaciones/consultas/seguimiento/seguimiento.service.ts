import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Seguimiento } from '@models/index';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class SeguimientoService {
    constructor(private http: HttpClient) {}

    postConsultasCargo(data: { codigoBarra: string[]; tipoServicio: number }): Observable<{ seguimientos: Seguimiento[] }> {
        return this.http.post(`${API_URL}cargos/consulta`, data).pipe(
            map((response: any) => {
                const seguimientos: Seguimiento[] = response.data.map(
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

                return { seguimientos };
            })
        );
    }

    postConsultasCargoMensajeria(data: { codigoBarra: string[]; tipoServicio: number }) {
        return this.http.post(`${API_URL}cargos/consulta`, data).pipe(
            map((response: any) => {
                const seguimientos = response.data.map((item) => ({
                    cliente: item.Cliente,
                    destinatario: item.Destinatario,
                    distrito: item.Distrito,
                    estado: item.Estado,
                    estadoDetalle: item.EstadoDetalle,
                    fechaDescargo: item.FechaDescargo ? moment(item.FechaDescargo).format('DD/MM/YYYY') : '-',
                    fechaSalida: item.FechaSalida ? moment(item.FechaSalida).format('DD/MM/YYYY') : '-',
                    fechaVisita: item.FechaVisita ? moment(item.FechaVisita).format('DD/MM/YYYY') : '-',
                    guiaOs: item.GuiaOs,
                    idOrdenServicio: item.IdOrdenServicio,
                    servicio: item.Servicio,
                }));

                return seguimientos;
            })
        );
    }
}
