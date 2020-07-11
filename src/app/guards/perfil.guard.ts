import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '@services/login/login.service';

@Injectable({
    providedIn: 'root',
})
export class PerfilGuard implements CanActivate, CanActivateChild {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.hasPermision(route.data);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasPermision(route.data);
    }

    hasPermision(data): boolean {
        const usuario = this.loginService.getUserLogeado();

        if (usuario && usuario.arrOpciones.includes(data.roleId[0])) {
            return true;
        } else {
            this.router.navigate(['/dashboard']);
            return false;
        }
    }
}
