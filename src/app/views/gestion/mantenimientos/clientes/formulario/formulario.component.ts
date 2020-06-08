import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    formularioCliente: FormGroup;
    tipoPagos: any[];
    selectedPago: any;
    departamentos: any[];
    selectedDepartamento: any;
    provincias: any[];
    selectedProvincia: any;
    distritos: any[];
    selectedDistrito: any;
    msj$: Subscription;
    idCliente: number;
    loading: boolean;
    nuevo: boolean;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private tablaGeneralService: TablaGeneralService,
        private ubigeoService: UbigeoService,
        private clienteService: ClienteService,
        private mensajeResponse: MensajeResponseService
    ) {}

    ngOnInit() {
        this.initData();
        this.listarSelects();
        this.nuevo = true;
        this.activatedRouter.params.subscribe((params) => {
            if (params.id) {
                this.idCliente = Number(params.id);
                this.nuevo = false;
                this.obtenerCliente();
            }
        });
        this.initForm();
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    initData() {
        this.loading = false;
        this.tipoPagos = [];
        this.selectedPago = { id: '', text: 'Seleccione Tipo' };
        this.departamentos = [];
        this.selectedDepartamento = { id: '', text: 'Seleccione Departamento' };
        this.provincias = [];
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia' };
        this.distritos = [];
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
    }

    initForm() {
        this.formularioCliente = this.fb.group({
            nombre: ['', Validators.required],
            ruc: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', Validators.required],
            correo: ['', Validators.required],
            contacto: ['', Validators.required],
            idUbigeo: ['', Validators.required],
            rubro: ['', Validators.required],
            idTipopago: ['', Validators.required],
            observacion: ['', Validators.required],
        });
    }

    listarSelects() {
        // Departamentos
        this.ubigeoService
            .getDepartamentos()
            .subscribe((response) => (this.departamentos = [{ id: '', text: 'Seleccione Departamento' }, ...response]));
        // this.ubigeoService.getDepartamentos().subscribe((response) => (this.departamentos = response));

        // Tipo de Pago
        this.tablaGeneralService.getSelectPorGrupo(6).subscribe((response: any) => {
            this.tipoPagos = response;
        });
    }

    obtenerCliente() {
        this.loading = true;
        this.clienteService.getUnCliente(this.idCliente).subscribe((response) => {
            console.log(response);
            this.formularioCliente.patchValue({
                nombre: response.Nombre,
                ruc: response.RUC,
                direccion: response.Direccion,
                telefono: response.Telefono,
                correo: response.Correo,
                contacto: response.Contacto,
                rubro: response.Rubro,
                observacion: response.Observacion,
            });

            this.selectedPago = this.tipoPagos.find((pago) => pago.id === response.IdTipoPago);
            this.selectedDepartamento = this.departamentos.find((departamento) => departamento.id === response.IdDepartamento);
            this.getProvincias(Number(response.IdProvincia));
            // this.getProvincias(Number(this.selectedDepartamento.id));
            // this.selectedProvincia = this.provincias.find((provincia) => provincia.id === response.IdProvincia);
            // this.selectedDistrito = this.distritos.find((distrito) => distrito.id === response.IdUbigeo);
            this.loading = false;
        });
    }

    changeTipoPago(event) {
        this.formularioCliente.patchValue({
            idTipopago: event.id,
        });
    }

    changeDepartamento(event) {
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia' };
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
        // this.ubigeoService
        //     .getHijos(Number(event.id))
        //     .subscribe((response) => (this.provincias = [{ id: '', text: 'Seleccione Provincias' }, ...response]));
        this.getProvincias(Number(event.id));
    }

    changeProvincia(event) {
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
        // this.ubigeoService
        //     .getHijos(Number(event.id))
        //     .subscribe((response) => (this.distritos = [{ id: '', text: 'Seleccione Distrito' }, ...response]));
        this.getDistritos(Number(event.id));
    }

    changeDistrito(event) {
        this.formularioCliente.patchValue({
            idUbigeo: Number(event.id),
        });
    }

    getProvincias(id: number) {
        this.ubigeoService.getHijos(id).subscribe((response) => {
            this.provincias = response;
        });
    }

    getDistritos(id: number) {
        this.ubigeoService.getHijos(id).subscribe((response) => (this.distritos = response));
    }

    guardarCliente() {
        this.clienteService.postClientes(this.formularioCliente.value).subscribe(
            (response) => {
                this.msj$ = this.mensajeResponse.succes('Cliente creado correctamente').subscribe((action) => {
                    if (action) {
                        this.atras();
                    }
                });
            },
            (error) => {
                console.log(error);
                this.msj$ = this.mensajeResponse.danger('Ocurrio un problema, intente nuevamente por favor.').subscribe();
            }
        );
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.clientes.init}`]);
    }
}
