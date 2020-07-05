import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cliente, PaginacionModel, Grupo, Ubigeo } from '@models/index';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    constructor(private http: HttpClient) {}

    getClientes(params): Observable<{ clientes: Cliente[]; paginacion: PaginacionModel }> {
        return this.http.get(`${API_URL}clientes`, { params }).pipe(
            map((response: any) => {
                console.log(response);
                const paginacion: PaginacionModel = response.paginacion;
                const clientes: Cliente[] = response.data.map((client) => {
                    const cliente: Cliente = {
                        ...new Cliente(),
                        idCliente: client.IdCliente,
                        sucursal: client.Sucursal,
                        fecAsignacion: moment(client.FecAsignacion).format('DD/MM/YYYY'),
                        estado: client.Flag_Activo,
                        nombre: client.Nombre,
                        ruc: client.RUC,
                        direccion: client.Direccion,
                        telefono: client.Telefono,
                        correo: client.Correo,
                        contacto: client.Contacto,
                        distrito: client.Ubigeo,
                        rubro: client.Rubro,
                        tipoPago: client.TipoPago,
                    };

                    return cliente;
                });

                return { clientes, paginacion };
            })
        );
    }

    getUnCliente(
        id: number
    ): Observable<{ cliente: Cliente; tipoPagos: Grupo[]; distritos: Ubigeo[]; provincias: Ubigeo[]; departamentos: Ubigeo[] }> {
        return this.http.get(`${API_URL}clientes/${id}`).pipe(
            map((response: any) => {
                const cliente: Cliente = {
                    ...new Cliente(),
                    idCliente: response.cliente.IdCliente,
                    fecAsignacion: moment(response.cliente.FecAsignacion).format('DD/MM/YYYY'),
                    estado: response.cliente.Flag_Activo,
                    nombre: response.cliente.Nombre,
                    ruc: response.cliente.RUC,
                    direccion: response.cliente.Direccion,
                    telefono: response.cliente.Telefono,
                    correo: response.cliente.Correo,
                    contacto: response.cliente.Contacto,
                    idUbigeo: response.cliente.IdUbigeo,
                    rubro: response.cliente.Rubro,
                    idTipoPago: response.cliente.IdTipoPago,
                    observacion: response.cliente.Observacion,
                    sucursales: response.cliente.sucursales,
                    idDepartamento: response.cliente.IdDepartamento,
                    idProvincia: response.cliente.IdProvincia,
                };

                const tipoPagos = response.tipoPago.map((tipo) => ({ id: tipo.IdTablaGeneral, text: tipo.Descripcion, grupo: tipo.Grupo }));
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

                return { cliente, tipoPagos, departamentos, provincias, distritos };
            })
        );
    }

    postClientes(data) {
        return this.http.post(`${API_URL}clientes`, data);
    }

    putCliente(id, data) {
        return this.http.put(`${API_URL}clientes/${id}`, data);
    }

    deleteCliente(id) {
        return this.http.delete(`${API_URL}clientes/${id}`);
    }
}
