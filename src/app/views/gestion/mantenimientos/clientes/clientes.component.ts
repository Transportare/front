import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
declare var $: any;

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit, OnDestroy {
    @ViewChild('detalleCliente', { static: false }) detalleCliente: ElementRef;
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
                direccion: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 2,
                razon_social: 'Enotria S.A.',
                direccion: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 3,
                razon_social: 'Enotria S.A.',
                direccion: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
            {
                id: 4,
                razon_social: 'Enotria S.A.',
                direccion: 'Av. Nicolas Ayllon 2890',
                oficina: 'OFICINA PRINCIPAL',
                distrito: 'CALLAO',
                ruc: '20519014280',
                tipo: 'Transferencia',
                estado: true,
            },
        ];
    }

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    nuevoProveedor() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${route.clientes.nuevo}`]);
    }

    detalle() {
        // const route = RUTAS_GESTION_MANTENIMIENTOS;
        // this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.detalle}`]);
        $(this.detalleCliente.nativeElement).modal('show');
    }

    cerrarModal() {
        $(this.detalleCliente.nativeElement).modal('hide');
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.editar}`]);
    }
}
