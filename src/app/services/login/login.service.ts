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

    private storageSub = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    logIng(data) {
        return this.http.post(`${API_URL}login`, data);
    }

    logOut() {
        localStorage.removeItem('data_user');
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

    // isLogin(): Observable<boolean> {
    //     return new Observable((observer) => {
    //         this.dataUser = this.getdataUser();

    //         if (this.dataUser != null && this.dataUser.token) {
    //             observer.next(true);
    //         } else {
    //             observer.next(false);
    //         }
    //         observer.complete();
    //     });
    // }

    // isLogin(): Observable<boolean> {
    //     return new Observable((observer) => {
    //         this.dataUser = this.getdataUser();

    //         this.idIntervalo = setInterval(() => {
    //             this.dataUser = this.getdataUser();
    //             if (this.dataUser != null && this.dataUser.token) {
    //                 observer.next(true);
    //             } else {
    //                 observer.next(false);
    //             }
    //         }, 1000);
    //     });
    // }

    // watchStorage(): Observable<any> {
    //     return this.storageSub.asObservable();
    // }

    saveDataUser(data) {
        localStorage.setItem('data_user', JSON.stringify(data));
        // this.storageSub.next(true);
    }

    // clearDataUser() {
    //     localStorage.removeItem('data_user');
    //     this.storageSub.next(false);
    // }

    getdataUser() {
        return JSON.parse(localStorage.getItem('data_user'));
    }
}
