import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '@services/login/login.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        window.addEventListener('storage', (e: any) => {
            const userData = window.localStorage.getItem('user_data');

            if (userData) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        });

        return this.checkLoggin();
    }

    canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        // console.log('Dentro del guard hijo');
        // return this.checkLoggin();
        return true;
    }

    checkLoggin() {
        if (this.loginService.isLogin()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
