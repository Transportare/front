import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '@services/login/login.service';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.loginService.isLogin()) {
            this.router.navigate(['/dashboard']);
        }

        return !this.loginService.isLogin();
    }
}
