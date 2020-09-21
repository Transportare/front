import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Seguimiento, PaginacionModel } from '@models/index';
import { RUTAS_PAQUETERIA_MANTENIMIENTOS, RUTAS_PAQUETERIA_CONSULTAS } from '@routes/rutas-paqueteria';
import { ClientePaqueteriaService } from '@services/modulos/operaciones/paqueteria/clientes/clientes.service';
declare var $: any;

@Component({
    selector: 'app-detalle-clientes',
    templateUrl: './detalle.component.html',
})
export class DetalleComponent implements OnInit, OnDestroy {
    id: string;
    loading: boolean;
    msj$: Subscription;
    pagina: number;
    filas: number;
    data: Seguimiento[];
    selectItem: Seguimiento;
    dataPaginacion: PaginacionModel;
    cliente: { nombres: string; ruc: string };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private clientePaqueteriaService: ClientePaqueteriaService
    ) {
        this.pagina = 1;
        this.filas = 10;
        this.data = [];
        this.selectItem = new Seguimiento();
        this.cliente = { nombres: '', ruc: '' };
        this.dataPaginacion = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.listar();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina.toString(),
            filas: this.filas.toString(),
        };

        this.clientePaqueteriaService.getConsultaCliente(this.id, params).subscribe(
            (response) => {
                this.data = response.cargos;
                this.cliente = response.cliente;
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

    detalle(id) {
        const route = RUTAS_PAQUETERIA_CONSULTAS;
        this.router.navigate([`${route.tracking.init}/${id}/${route.tracking.detalle}`]);
    }

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_MANTENIMIENTOS.clientes.init}`]);
    }
}
