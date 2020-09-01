import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
import { RutaService } from '@services/modulos/operaciones/paqueteria/ruta/ruta.service';
import { PaginacionModel, Ruta } from '@models/index';

@Component({
    selector: 'app-ruta',
    templateUrl: './ruta.component.html',
})
export class RutaComponent implements OnInit {
    loading: boolean;
    selectItem: Ruta;
    data: Ruta[];
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    constructor(private router: Router, private rutaService: RutaService) {
        this.loading = false;
        this.selectItem = new Ruta();
        this.data = [];
        this.pagina = 1;
        this.filas = 10;
        this.dataPaginacion = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
    }

    ngOnInit(): void {
        this.listar();
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
        };

        this.rutaService.getRutas(params).subscribe(
            (response: any) => {
                this.data = response.rutas;

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
                this.loading = false;
            }
        );
    }

    detalle() {
        this.router.navigate([
            `${RUTAS_OPERACIONES_PAQUETERIA.ruta.init}/${this.selectItem.guiaOs}/${RUTAS_OPERACIONES_PAQUETERIA.ruta.detalle}`,
        ]);
    }

    tracking() {}

    nuevo() {
        this.router.navigate([`${RUTAS_OPERACIONES_PAQUETERIA.ruta.init}/${RUTAS_OPERACIONES_PAQUETERIA.ruta.nuevo}`]);
    }
}
