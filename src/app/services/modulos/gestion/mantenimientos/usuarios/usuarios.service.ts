import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { Usuario } from '@models/usuario';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
    constructor(private http: HttpClient) {}

    getUsuarios(): Observable<Usuario[]> {
        const usuarioVacio = new Usuario();
        return this.http.get(`${API_URL}usuarios`).pipe(
            map((response: any) => {
                console.log(response.data);
                return response.data.map((usuario) => ({
                    ...usuarioVacio,
                    idUsuario: usuario.IdUsuario,
                    estado: usuario.Flag_Activo,
                    dni: usuario.DNI,
                    usuario: usuario.Usuario,
                }));
            })
        );
    }
}
