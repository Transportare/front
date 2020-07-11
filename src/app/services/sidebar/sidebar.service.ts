import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config/api.route';
import { LoginService } from '@services/login/login.service';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    constructor(private http: HttpClient, private loginService: LoginService) {}

    listarMenu() {
        const data = this.loginService.getdataUser();
        if (data) {
            const response = JSON.parse(atob(data.token.split('.')[1]));
            return this.http.get(`${API_URL}opciones/${response.usuarioToken.IdPerfil}`);
        }
    }
}
