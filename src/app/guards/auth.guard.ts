import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
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
        console.log('Dentro del guard');
        // console.log(this.loginService.isLogin());

        // if (this.loginService.isLogin()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return false;
        // }
        // this.loginService.isLogin().subscribe((response) => {
        //     console.log(response);

        //     this.token = response;

        //     // if (this.token) {
        //     //     return true;
        //     // } else {
        //     //     this.router.navigate(['/login']);
        //     //     return false;
        //     // }
        // });

        // this.loginService.isLogin().subscribe((response) => {
        //     console.log(response);
        // });

        // let resp = this.checkLoggin();

        // timer(0, 1000).subscribe(() => {
        //     resp = this.checkLoggin();
        //     console.log(resp);
        // });

        // setInterval(() => {
        //     resp = this.checkLoggin();
        //     console.log(resp);
        // }, 5000);

        // this.loginService.watchStorage().subscribe((response: boolean) => {
        //     console.log(response);
        //     // this will call whenever your localStorage data changes
        //     // use localStorage code here and set your data here for ngFor
        // });

        // console.log(this.loginService.getdataUser());

        window.addEventListener('storage', (e: any) => {
            if (e.key === 'data_user') {
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
