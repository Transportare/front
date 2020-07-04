import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Usuario } from '@models/usuario';
import { map, filter } from 'rxjs/operators';
import { TreeviewItem } from 'ngx-treeview';
import { Perfil } from '@models/perfil';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
    constructor(private http: HttpClient) {}

    getUsuarios(): Observable<Usuario[]> {
        const usuarioVacio = new Usuario();
        return this.http.get(`${API_URL}usuarios`).pipe(
            map((response: any) => {
                return response.data.map((usuario) => {
                    const user: Usuario = {
                        ...usuarioVacio,
                        idUsuario: usuario.IdUsuario,
                        estado: usuario.Flag_Activo,
                        dni: usuario.DNI,
                        usuario: usuario.Usuario,
                        perfil: usuario.IdPerfil,
                        nombrePerfil: usuario.NombrePerfil,
                    };

                    return user;
                });
            })
        );
    }

    getPerfiles(): Observable<Perfil[]> {
        return this.http.get(`${API_URL}perfiles`).pipe(
            map((response: any) => {
                const perfiles = response.data.filter((p) => p.Flag_Activo === 1);

                return perfiles.map((perfil) => {
                    return { id: perfil.IdPerfil, text: perfil.NombrePerfil, estado: perfil.Flag_Activo };
                });
            })
        );
    }

    postUsuario(data: Usuario) {
        return this.http.post(`${API_URL}usuarios`, data);
    }

    putPerfil(usuario: Usuario, id) {
        const data = {
            dni: usuario.dni,
            idPerfil: usuario.perfil,
            estado: usuario.estado,
        };

        return this.http.put(`${API_URL}usuarios/${id}`, data);
    }

    getPerfilByUser(idUsuario): Observable<TreeviewItem[]> {
        return this.http.get(`${API_URL}perfiles/getPrivilegios/${idUsuario}`).pipe(
            map((response: any) => {
                const privilegios: TreeviewItem[] = response.data.map((privilegio) => {
                    return new TreeviewItem({
                        text: privilegio.NomOpcion,
                        value: privilegio.IdOpcion,
                        collapsed: true,
                        checked: false,
                        disabled: true,
                        children: privilegio.hijos.map((hijo) => {
                            return {
                                text: hijo.NomOpcion,
                                value: hijo.IdOpcion,
                                collapsed: true,
                                checked: false,
                                children: hijo.hijos.map((hijo2) => {
                                    return {
                                        text: hijo2.NomOpcion,
                                        value: hijo2.IdOpcion,
                                        collapsed: true,
                                        checked: false,
                                    };
                                }),
                            };
                        }),
                    });
                });

                return privilegios;
            })
        );
    }

    putPassword(id, data) {
        return this.http.put(`${API_URL}usuarios/updatePass/${id}`, data);
    }
}
