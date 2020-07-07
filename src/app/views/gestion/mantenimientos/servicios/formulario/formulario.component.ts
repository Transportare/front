import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grupo, Servicio } from '@models/index';
import { ServiciosService } from '@services/modulos/gestion/mantenimientos/servicios/servicios.service';
import { LoginService } from '@services/login/login.service';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    formServicio: FormGroup;
    id: string;
    tipoServicios: Grupo[];
    tipoSelected: Grupo;
    clientes: Grupo[];
    clienteSelected: Grupo;
    loading: boolean;
    loadingSucursales: boolean;
    usuario: any;
    activos: string[];
    sucursales: any[];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private serviciosService: ServiciosService,
        private activatedRoute: ActivatedRoute,
        private loginService: LoginService
    ) {}

    ngOnInit() {
        this.loading = false;
        this.loadingSucursales = false;
        this.usuario = {};
        this.tipoServicios = [];
        this.sucursales = [];
        this.activos = [];
        this.tipoSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.clientes = [];
        this.clienteSelected = { id: 0, text: 'Seleccione Cliente', grupo: '' };
        this.initForm();
        this.usuario = this.loginService.getUserLogeado();
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.obtenerServicio();
            } else {
                this.listarSelects();
            }
        });
    }

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    initForm() {
        this.formServicio = this.fb.group({
            idSucursal: [1, Validators.required],
            idCliente: ['', Validators.required],
            idTipoServicio: ['', Validators.required],
            nombre: ['', Validators.required],
            tiempo: ['', Validators.required],
            observacion: [''],
            sucursales: ['', Validators.required],
        });
    }

    listarSelects() {
        this.loading = true;
        this.serviciosService.listarSelects().subscribe(
            (response) => {
                this.tipoServicios = response.tipoServicios;
                this.clientes = response.clientes;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    obtenerServicio() {
        this.loading = true;
        this.serviciosService.getOneServicio(this.id, { dni: this.usuario.DNI }).subscribe(
            (response) => {
                const servicio: Servicio = response.servicio;
                this.tipoServicios = response.tipoServicios;
                this.tipoSelected = this.tipoServicios.find((tipo) => tipo.id === servicio.idTipoServicio);
                this.clientes = response.clientes;
                this.clienteSelected = this.clientes.find((cliente) => cliente.id === servicio.idCliente);
                this.sucursales = response.sucursales;
                this.activos = servicio.sucursales;
                this.formServicio.patchValue({
                    idSucursal: 1,
                    idCliente: servicio.idCliente,
                    idTipoServicio: servicio.idTipoServicio,
                    nombre: servicio.nombre,
                    tiempo: servicio.tiempo,
                    observacion: servicio.observacion,
                    sucursales: servicio.sucursales,
                });
                console.log(response);
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    changeCliente(event: Grupo) {
        this.clienteSelected = event;
        this.formServicio.patchValue({
            idCliente: event.id,
        });
        this.serviciosService.getSucursalesByCliente({ idCliente: event.id, dni: this.usuario.DNI }).subscribe(
            (response) => {
                this.loading = true;
                this.sucursales = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    changeTiempo(event) {
        this.formServicio.patchValue({ tiempo: Number(event) });
    }

    guardarServicio() {
        console.log(this.formServicio.value);
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.servicios.init}`]);
    }
}
