import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
declare var $: any;

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit, AfterViewInit, OnDestroy {
    data: any[];
    selectItem: any;

    constructor(private router: Router) {
        this.selectItem = {};
    }

    ngOnInit() {
        this.data = [
            {
                id: 1,
                razon_social: 'Enotria S.A.',
                direccionj: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 2,
                razon_social: 'Enotria S.A.',
                direccionj: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 3,
                razon_social: 'Enotria S.A.',
                direccionj: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 4,
                razon_social: 'Enotria S.A.',
                direccionj: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
        ];
    }

    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip();
    }

    ngOnDestroy(): void {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    nuevoProveedor() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${route.clientes.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.editar}`]);
    }
}
