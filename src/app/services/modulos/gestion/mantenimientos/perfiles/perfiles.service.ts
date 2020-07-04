import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Perfil } from '@models/perfil';
import { Usuario } from '@models/usuario';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
    providedIn: 'root',
})
export class PerfilService {
    constructor(private http: HttpClient) {}

    getPerfiles(): Observable<Perfil[]> {
        return this.http.get(`${API_URL}perfiles`).pipe(
            map((response: any) => {
                return response.data.map((perfil) => {
                    return { idPerfil: perfil.IdPerfil, nombrePerfil: perfil.NombrePerfil, estado: perfil.Flag_Activo };
                });
            })
        );
    }

    getDataPorPerfil(idPerfil): Observable<{ usuarios: Usuario[]; privilegios: TreeviewItem[] }> {
        return this.http.get(`${API_URL}perfiles/getUsuariosPrivilegios/${idPerfil}`).pipe(
            map((response: any) => {
                const usuarioVacio = new Usuario();

                const usuarios: Usuario[] = response.usuarios.map((usuario) => {
                    return {
                        ...usuarioVacio,
                        idUsuario: usuario.IdUsuario,
                        fechaAsigancion: moment(usuario.FechaAsignacion).format('YYYY-MM-DD'),
                        estado: usuario.Flag_Activo,
                        usuario: usuario.Usuario,
                        dni: usuario.DNI,
                    };
                });

                const privilegios: TreeviewItem[] = response.privilegios.map((privilegio) => {
                    return new TreeviewItem({
                        text: privilegio.NomOpcion,
                        value: privilegio.IdOpcion,
                        collapsed: false,
                        checked: privilegio.checked,
                        children: privilegio.hijos.map((hijo) => {
                            return {
                                text: hijo.NomOpcion,
                                value: hijo.IdOpcion,
                                checked: hijo.checked,
                                children: hijo.hijos.map((hijo2) => {
                                    return {
                                        text: hijo2.NomOpcion,
                                        value: hijo2.IdOpcion,
                                        checked: hijo2.checked,
                                    };
                                }),
                            };
                        }),
                    });
                });

                return { usuarios, privilegios };
            })
        );
    }

    getPrivilegiosPorPerfil(id, data) {
        return this.http.post(`${API_URL}opciones/setPrivilegios/${id}`, data);
    }

    postPerfil(data: Perfil) {
        return this.http.post(`${API_URL}perfiles`, data);
    }

    putPerfil(data: Perfil) {
        return this.http.put(`${API_URL}perfiles/${data.idPerfil}`, data);
    }
}
