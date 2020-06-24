import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
import { PaginacionModel } from '@models/paginacion.model';
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
    loading: boolean;
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;

    constructor(private clienteService: ClienteService, private router: Router) {
        this.selectItem = {};
    }

    ngOnInit() {
        this.loading = false;
        this.pagina = 1;
        this.filas = 10;
        this.data = [];
        this.dataPaginacion = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
        this.listar();
    }

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
        };

        this.clienteService.getClientes(params).subscribe(
            (response: any) => {
                this.data = response.data;

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

    // obtenerCliente() {
    //     console.log(this.selectItem);
    // }

    changePage(event) {
        console.log(event);
    }

    nuevoProveedor() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${route.clientes.nuevo}`]);
    }

    detalle() {
        // const route = RUTAS_GESTION_MANTENIMIENTOS;
        // this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.detalle}`]);
        $(this.detalleCliente.nativeElement).modal('show');
        // this.obtenerCliente();
    }

    cerrarModal() {
        $(this.detalleCliente.nativeElement).modal('hide');
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${this.selectItem.IdCliente}/${route.clientes.editar}`]);
    }
}
