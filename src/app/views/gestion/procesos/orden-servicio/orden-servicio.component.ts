import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { OrdenServicioService } from '@services/modulos/gestion/procesos/orden-servicio/orden-servicio.service';
import * as moment from 'moment';
import { PaginacionModel, OrdenServicio, Grupo } from '@models/index';
declare var $: any;

@Component({
    selector: 'app-orden-servicio',
    templateUrl: './orden-servicio.component.html',
})
export class OrdenServicioComponent implements OnInit, OnDestroy {
    selectItem: OrdenServicio;
    ordenes: OrdenServicio[];
    loading: boolean;
    msj$: Subscription;
    observacion: FormControl;
    servicios: Grupo[];
    servicioSelected: Grupo;
    clientes: Grupo[];
    clienteSelected: Grupo;
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    @ViewChild('modalNuevaOrden', { static: false }) modalNuevaOrden: ElementRef;
    @ViewChild('modalEditarOrden', { static: false }) modalEditarOrden: ElementRef;

    constructor(
        private router: Router,
        private mensajeResponse: MensajeResponseService,
        private orderServicioService: OrdenServicioService
    ) {
        this.pagina = 1;
        this.filas = 10;
        this.selectItem = new OrdenServicio();
        this.observacion = new FormControl('');
        this.dataPaginacion = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
        this.ordenes = [];
        this.clientes = [];
        this.servicios = [];
        this.servicioSelected = { id: 0, text: 'Seleccionar Servicio', grupo: '' };
        this.clienteSelected = { id: 0, text: 'Seleccionar Cliente', grupo: '' };
        this.loading = false;
    }

    ngOnInit(): void {
        this.listar();
        this.getClientes();
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
        };
        this.orderServicioService.getOrdenServicios(params).subscribe((response) => {
            this.ordenes = response.ordenes;

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
        });
    }

    // NUeva Orden de Servicio

    getClientes() {
        this.orderServicioService.getClientes().subscribe((respone) => {
            this.clientes = respone;
        });
    }

    nuevo() {
        this.selectItem = new OrdenServicio();
        $(this.modalNuevaOrden.nativeElement).modal('show');
    }

    cerrarModal() {
        $(this.modalNuevaOrden.nativeElement).modal('hide');
        this.selectItem = new OrdenServicio();
    }

    changeCliente(event) {
        this.clienteSelected = event;
        this.orderServicioService.getServiciosClientes(event.id).subscribe((response) => {
            this.servicios = response;
        });
    }

    generarOrden() {
        const fechaInicio = this.addWeekdays(moment().format('YYYY-MM-DD'), 2);

        const data = {
            fechaCreacion: moment().format('YYYY-MM-DD'),
            fechaInicio: fechaInicio.format('YYYY-MM-DD'),
            idCliente: this.clienteSelected.id,
            idServicio: this.servicioSelected.id,
            observacion: this.observacion.value,
        };

        this.orderServicioService.postOrdenServicio(data).subscribe(
            (response: any) => {
                this.cerrarModal();
                this.msj$ = this.mensajeResponse.succes(`Orden de Servicio N° ${response.id} creado correctamente`).subscribe((action) => {
                    if (action) {
                        this.router.navigate(['/gestion/procesos/carga-datos']);
                    }
                });
            },
            (error) => {
                this.msj$ = this.mensajeResponse.danger().subscribe();
            }
        );
    }

    addWeekdays(date, days) {
        date = moment(date); // use a clone
        while (days > 0) {
            date = date.add(1, 'days');
            // decrease "days" only if it's a weekday.
            if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
                days -= 1;
            }
        }
        return date;
    }

    // addBusinessDays(date, numDaysToAdd) {
    //     const Sunday = 0;
    //     const Saturday = 6;
    //     const newDate = date.clone();

    //     while (numDaysToAdd > 0) {
    //         newDate.add(1, 'days');
    //         if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
    //             numDaysToAdd--;
    //         }
    //     }

    //     return newDate;
    // }

    generarPerfil() {
        // const perfil: Perfil = new Perfil();
        // if (!this.selectItem.idPerfil) {
        //     // Nuevo
        //     this.perfilService.postPerfil({ ...perfil, nombrePerfil: this.nombrePerfil.value }).subscribe(
        //         (response) => {
        //             this.cerrarModal();
        //             this.msj$ = this.mensajeResponse.succes('Perfil creado correctamente').subscribe((action) => {
        //                 if (action) {
        //                     this.listar();
        //                     this.selectItem = new Perfil();
        //                 }
        //             });
        //         },
        //         (error) => {
        //             this.msj$ = this.mensajeResponse.danger().subscribe();
        //         }
        //     );
        // } else {
        //     // Editar
        //     this.perfilService
        //         .putPerfil({
        //             idPerfil: this.selectItem.idPerfil,
        //             nombrePerfil: this.nombrePerfil.value,
        //             estado: this.estadoSelected.id,
        //         })
        //         .subscribe(
        //             (response) => {
        //                 this.cerrarModal();
        //                 this.msj$ = this.mensajeResponse.succes('Perfil actualizado correctamente').subscribe((action) => {
        //                     if (action) {
        //                         this.listar();
        //                         this.selectItem = new Perfil();
        //                     }
        //                 });
        //             },
        //             (error) => {
        //                 this.msj$ = this.mensajeResponse.danger().subscribe();
        //             }
        //         );
        // }
    }

    // Editar Orden Servicio

    editar() {
        // this.nombrePerfil.setValue(this.selectItem.nombrePerfil);
        // this.estadoSelected = this.estados.find((e) => e.id === this.selectItem.estado);
        $(this.modalEditarOrden.nativeElement).modal('show');
    }

    generarEditarOrden() {}

    cerrarEditarOrden() {
        $(this.modalEditarOrden.nativeElement).modal('hide');
    }

    //

    // detalle() {
    //     const route = RUTAS_GESTION_MANTENIMIENTOS;
    //     this.router.navigate([`${route.perfiles.init}/${this.selectItem.idPerfil}/${route.perfiles.detalle}`]);
    // }
}
