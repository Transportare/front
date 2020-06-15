import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { SucursalesService } from '@services/utils/sucursales.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    sucursales: any[];
    sucursalSelected: any;
    loading: boolean;

    constructor(
        private loginService: LoginService,
        private sucursalesService: SucursalesService,
        private router: Router,
        private location: Location
    ) {
        this.loading = false;
        this.sucursales = [];
        this.sucursalSelected = { id: '', text: 'Seleccione Sucursal' };
    }

    ngOnInit() {
        this.listarSucursales();
        this.sucursalesService.changeSucursal().subscribe((response) => {
            this.sucursalSelected = this.sucursales.find((sucursal) => sucursal.id === response);
        });
    }

    listarSucursales() {
        this.loading = true;
        this.sucursalesService.getSucursales().subscribe((response: any) => {
            this.sucursales = response;
            const id = this.sucursalesService.getSucursal();
            if (id) {
                this.sucursalSelected = this.sucursales.find((s) => s.id === Number(id));
            }
            this.loading = false;
        });
    }

    changeSucursal(event) {
        // console.log(event);
        this.sucursalesService.sucursalElegida(event.id);
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
            console.log(decodeURI(this.location.path()));
            this.router.navigate([decodeURI(this.location.path())]);
        });
    }

    logOut() {
        this.loginService.logOut();
        this.router.navigate(['/login']);
    }
}
