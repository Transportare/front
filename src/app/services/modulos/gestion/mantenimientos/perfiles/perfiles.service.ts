import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Perfil } from '@models/perfil';

@Injectable({
    providedIn: 'root',
})
export class PerfilService {
    constructor(private http: HttpClient) {}

    getPerfiles(): Observable<Perfil[]> {
        return this.http.get(`${API_URL}perfiles`).pipe(
            map((response: any) => {
                // const perfil = new Perfil();

                return response.data.map((perfil) => {
                    return { idPerfil: perfil.IdPerfil, nombrePerfil: perfil.NombrePerfil, estado: perfil.Flag_Activo };
                });
            })
        );
    }

    postPerfil(data: Perfil) {
        return this.http.post(`${API_URL}perfiles`, data);
    }

    putPerfil(data: Perfil) {
        return this.http.put(`${API_URL}perfiles/${data.idPerfil}`, data);
    }
}