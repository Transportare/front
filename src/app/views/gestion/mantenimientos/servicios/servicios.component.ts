import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

@Component({
    selector: 'app-servicios',
    templateUrl: './servicios.component.html',
    styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
    selectItem: any;
    data: any[];

    constructor(private router: Router) {
        this.selectItem = {};
    }

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.data = [
            {
                id: 1,
                sucursal: 'Sucursal 1',
                cliente: 'Cliente 1',
                tipo_servicio: 'Normal',
                nombre: 'BBVA',
                tiempo: '04 Días',
                observacion: 'AVL',
                estado: true,
            },
            {
                id: 2,
                sucursal: 'Sucursal 2',
                cliente: 'Cliente 1',
                tipo_servicio: 'Normal',
                nombre: 'BBVA',
                tiempo: '04 Días',
                observacion: 'AVL',
                estado: true,
            },
            {
                id: 3,
                sucursal: 'Sucursal 3',
                cliente: 'Cliente 1',
                tipo_servicio: 'Normal',
                nombre: 'BBVA',
                tiempo: '04 Días',
                observacion: 'AVL',
                estado: true,
            },
            {
                id: 4,
                sucursal: 'Sucursal 4',
                cliente: 'Cliente 1',
                tipo_servicio: 'Normal',
                nombre: 'BBVA',
                tiempo: '04 Días',
                observacion: 'AVL',
                estado: true,
            },
            {
                id: 5,
                sucursal: 'Sucursal 5',
                cliente: 'Cliente 1',
                tipo_servicio: 'Normal',
                nombre: 'BBVA',
                tiempo: '04 Días',
                observacion: 'AVL',
                estado: true,
            },
        ];
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.servicios.init}/${RUTAS_GESTION_MANTENIMIENTOS.servicios.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.id}/${route.servicios.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.id}/${route.servicios.editar}`]);
    }
}
