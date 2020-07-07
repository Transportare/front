import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { Servicio } from '@models/servicio';
import { ServiciosService } from '@services/modulos/gestion/mantenimientos/servicios/servicios.service';
import { PaginacionModel } from '@models/index';

@Component({
    selector: 'app-servicios',
    templateUrl: './servicios.component.html',
    styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
    selectItem: Servicio;
    servicios: Servicio[];
    loading: boolean;
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;

    constructor(private router: Router, private servicioService: ServiciosService) {
        this.selectItem = new Servicio();
        this.loading = false;
        this.pagina = 1;
        this.filas = 10;
        this.servicios = [];
        this.dataPaginacion = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
    }

    ngOnInit() {
        this.listar();
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
        };

        this.servicioService.getServicios(params).subscribe(
            (response) => {
                this.servicios = response.servicios;

                if (response.paginacion) {
                    this.dataPaginacion = new PaginacionModel(
                        response.paginacion.item_desde,
                        response.paginacion.item_hasta,
                        response.paginacion.item_pagina,
                        response.paginacion.item_total,
                        response.paginacion.pag_actual,
                        response.paginacion.pag_anterior,
                        response.paginacion.pag_siguiente,
                        response.paginacion.pag_total
                    );
                }

                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.servicios.init}/${RUTAS_GESTION_MANTENIMIENTOS.servicios.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.idServicio}/${route.servicios.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.idServicio}/${route.servicios.editar}`]);
    }
}
