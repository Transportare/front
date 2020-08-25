import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
import { PaginacionModel } from '@models/paginacion.model';
import { Cliente } from '@models/index';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
declare var $: any;

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit, OnDestroy {
    @ViewChild('detalleCliente', { static: false }) detalleCliente: ElementRef;
    data: Cliente[];
    selectItem: Cliente;
    loading: boolean;
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    msj$: Subscription;

    constructor(private clienteService: ClienteService, private router: Router, private mensajeResponse: MensajeResponseService) {
        this.selectItem = new Cliente();
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
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
            tipoCliente: 82,
        };

        this.clienteService.getClientes(params).subscribe(
            (response) => {
                this.data = response.clientes;

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

    delete() {
        this.msj$ = this.mensajeResponse.action('Se eliminara el cliente permanentemente', true).subscribe((action) => {
            if (action) {
                this.clienteService.deleteCliente(this.selectItem.idCliente).subscribe(
                    (response) => {
                        this.msj$ = this.mensajeResponse.succes('Cliente eliminado correctamente').subscribe((a) => {
                            if (a) {
                                this.listar();
                            }
                        });
                    },
                    (error) => {
                        this.msj$ = this.mensajeResponse.danger().subscribe();
                    }
                );
            }
        });
    }

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
        this.router.navigate([`${route.clientes.init}/${this.selectItem.idCliente}/${route.clientes.editar}`]);
    }
}
