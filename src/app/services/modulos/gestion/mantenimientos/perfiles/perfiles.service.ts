import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Perfil } from '@models/perfil';
import { Usuario } from '@models/usuario';
import * as moment from 'moment';

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

    getUsuariosPorPerfil(idPerfil): Observable<{ usuarios: Usuario[]; privilegios: any[] }> {
        return new Observable((observer) => {
            this.http
                .get(`${API_URL}perfiles/getUsuarios/${idPerfil}`)
                .pipe(
                    map((response: any) => {
                        const usuarioVacio = new Usuario();

                        const usuarios: Usuario[] = response.data.map((usuario) => {
                            return {
                                ...usuarioVacio,
                                idUsuario: usuario.IdUsuario,
                                fechaAsigancion: moment(usuario.FechaAsignacion).format('YYYY-MM-DD'),
                                estado: usuario.Flag_Activo,
                                usuario: usuario.Usuario,
                                dni: usuario.DNI,
                            };
                        });

                        return usuarios;
                    })
                )
                .subscribe((usuarios) => {
                    this.http
                        .get(`${API_URL}opciones/${idPerfil}`)
                        .pipe(
                            map((response: any) => {
                                // const privilegios = response.menu.map((privilegio) => ({ ...privilegio }));
                                const privilegios = response;
                                return privilegios;
                            })
                        )
                        .subscribe((privilegios) => {
                            observer.next({ usuarios, privilegios });
                            observer.complete();
                        });
                });
        });
    }

    postPerfil(data: Perfil) {
        return this.http.post(`${API_URL}perfiles`, data);
    }

    putPerfil(data: Perfil) {
        return this.http.put(`${API_URL}perfiles/${data.idPerfil}`, data);
    }
}
