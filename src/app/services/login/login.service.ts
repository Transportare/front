import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from 'config/api.route';
import { Observable, Subject, timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    idIntervalo: any;
    dataUser: any = {};

    constructor(private http: HttpClient, private router: Router) {}

    logIng(data) {
        return this.http.post(`${API_URL}login`, data);
    }

    logOut() {
        localStorage.removeItem('user_data');
        localStorage.removeItem('sucursal');
    }

    isLogin() {
        const data = this.getdataUser();

        if (!data) {
            return false;
        }

        if (data.token) {
            return true;
        } else {
            return false;
        }
    }

    saveDataUser(data) {
        localStorage.setItem('user_data', JSON.stringify(data));
    }

    getdataUser() {
        return JSON.parse(localStorage.getItem('user_data'));
    }
}
