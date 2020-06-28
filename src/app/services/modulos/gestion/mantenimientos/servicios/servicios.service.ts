import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '@models/servicio';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ServiciosService {
    constructor(private http: HttpClient) {}

    getServicios(): Observable<Servicio[]> {
        return this.http.get(`${API_URL}servicios`).pipe(
            map((response: any) => {
                return response.data.map((servicio) => ({
                    idServicio: servicio.IdServicio,
                    idCliente: servicio.IdCliente,
                    cliente: servicio.Cliente,
                    idTipoServicio: servicio.IdTipoServicio,
                    nombre: servicio.Nombre,
                    tiempo: servicio.Tiempo,
                    observacion: servicio.Observacion,
                    descripcion: servicio.Descripcion,
                }));
            })
        );
    }
}
