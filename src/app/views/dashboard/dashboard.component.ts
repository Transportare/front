import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SucursalesService } from '@services/utils/sucursales.service';
declare var $: any;
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    @ViewChild('elegirSucursal', { static: true }) elegirSucursal: ElementRef;
    sucursales: any[];
    loading: boolean;

    constructor(private sucursalesService: SucursalesService) {
        this.sucursales = [];
        this.loading = false;
    }

    ngOnInit() {
        this.listarSucursales();
        const sucursal = this.sucursalesService.getSucursal();
        if (!sucursal) {
            this.abrirModal();
        }
    }

    // listarSucursales() {
    //     this.loading = true;
    //     this.sucursalesService.getSucursales().subscribe((response: any) => {
    //         this.sucursales = response;
    //         this.loading = false;
    //     });
    // }

    listarSucursales() {
        this.loading = true;
        this.sucursales = this.sucursalesService.getSucursales();
        this.loading = false;
    }

    seleccionarSucursal(id: number) {
        this.sucursalesService.sucursalElegida(id);
        this.cerrarModal();
    }

    abrirModal() {
        $(this.elegirSucursal.nativeElement).modal('show');
    }

    cerrarModal() {
        $(this.elegirSucursal.nativeElement).modal('hide');
    }
}
