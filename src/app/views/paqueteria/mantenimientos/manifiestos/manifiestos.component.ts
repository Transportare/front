import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
import { PaginacionModel, Ruta, Manifiesto } from '@models/index';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { RUTAS_PAQUETERIA_DESPACHOS } from '@routes/rutas-paqueteria';

@Component({
    selector: 'app-ruta',
    templateUrl: './manifiestos.component.html',
})
export class ManifiestosComponent implements OnInit {
    loading: boolean;
    selectItem: Manifiesto;
    data: Manifiesto[];
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    constructor(private router: Router, private manifiestoService: ManifiestoService) {
        this.loading = false;
        this.selectItem = new Manifiesto();
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

        this.manifiestoService.getManifiestos(params).subscribe(
            (response) => {
                this.data = response.manifiestos;

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
        const route = RUTAS_PAQUETERIA_DESPACHOS;
        this.router.navigate([`${route.salidaRuta.init}/${this.selectItem.idGuia}/${route.salidaRuta.cargos}`]);
    }
}
