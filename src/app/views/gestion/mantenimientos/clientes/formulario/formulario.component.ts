import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { SucursalesService } from '@services/utils/sucursales.service';
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
    sucursales: any[];

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private tablaGeneralService: TablaGeneralService,
        private ubigeoService: UbigeoService,
        private clienteService: ClienteService,
        private mensajeResponse: MensajeResponseService,
        private sucursaleService: SucursalesService
    ) {}

    ngOnInit() {
        this.initData();
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
        this.sucursales = [];
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia' };
        this.distritos = [];
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
        this.nuevo = true;
        this.initForm();
        this.listarSelects();
        this.activatedRouter.params.subscribe((params) => {
            if (params.id) {
                this.idCliente = Number(params.id);
                this.nuevo = false;
                this.obtenerCliente();
            }
        });
    }

    initForm() {
        this.formularioCliente = this.fb.group({
            nombre: ['', Validators.required],
            ruc: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', Validators.required],
            correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
            contacto: ['', Validators.required],
            idUbigeo: ['', Validators.required],
            rubro: ['', Validators.required],
            idTipoPago: ['', Validators.required],
            observacion: ['', Validators.required],
            sucursales: this.fb.array([], [Validators.required]),
        });
    }

    onCheckboxChange(e) {
        const sucursales: FormArray = this.formularioCliente.get('sucursales') as FormArray;

        if (e.target.checked) {
            sucursales.push(new FormControl(e.target.value));
        } else {
            sucursales.controls.forEach((item: FormControl, index) => {
                if (item.value === e.target.value) {
                    sucursales.removeAt(index);
                    return;
                }
            });
        }
    }

    listarSelects() {
        this.loading = true;
        // Departamentos
        this.ubigeoService.getDepartamentos().subscribe((response) => (this.departamentos = response));
        // this.ubigeoService.getDepartamentos().subscribe((response) => (this.departamentos = response));

        // Tipo de Pago
        this.tablaGeneralService.getSelectPorGrupo(6).subscribe((response: any) => {
            this.tipoPagos = response;
        });

        // Sucursales
        this.sucursaleService.getSucursales().subscribe((response) => {
            this.sucursales = response;
        });

        this.loading = false;
    }

    obtenerCliente() {
        this.loading = true;
        this.clienteService.getUnCliente(this.idCliente).subscribe(
            (response) => {
                console.log(response);
                this.selectedDistrito = { id: response.IdUbigeo, text: response.Distrito };
                this.selectedPago = { id: response.IdTipoPago, text: response.TipoPago };
                this.formularioCliente.patchValue({
                    nombre: response.Nombre,
                    ruc: response.RUC,
                    direccion: response.Direccion,
                    telefono: response.Telefono,
                    correo: response.Correo,
                    contacto: response.Contacto,
                    rubro: response.Rubro,
                    observacion: response.Observacion,
                    idTipoPago: response.IdTipoPago,
                    idUbigeo: response.IdUbigeo,
                });

                // this.selectedPago = this.tipoPagos.find((pago) => pago.id === response.IdTipoPago);
                // this.selectedDepartamento = this.departamentos.find((departamento) => departamento.id === response.IdDepartamento);
                // console.log(this.selectedDepartamento);
                // console.log(this.selectedDepartamento);
                // this.getProvincias(Number(this.selectedDepartamento.id));
                // this.ubigeoService.getHijos(Number(response.IdDepartamento)).subscribe((r) => {
                //     this.provincias = r;
                // });

                this.getProvincias(response.IdDepartamento);

                // this.ubigeoService.getHijos(Number(response.IdProvincia)).subscribe((r) => {
                //     this.distritos = r;
                // });

                this.getDistritos(response.IdProvincia);
                // this.selectedProvincia = this.provincias.find((provincia) => provincia.id === response.IdProvincia);
                // this.selectedDistrito = this.distritos.find((distrito) => distrito.id === response.IdUbigeo);
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    changeTipoPago(event) {
        this.formularioCliente.patchValue({
            idTipoPago: event.id,
        });
    }

    changeDepartamento(event) {
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia' };
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
        this.distritos = [];
        // this.ubigeoService
        //     .getHijos(Number(event.id))
        //     .subscribe((response) => (this.provincias = [{ id: '', text: 'Seleccione Provincias' }, ...response]));
        // this.getProvincias(Number(event.id));
        this.getProvincias(event.id);
        // this.ubigeoService.getHijos(Number(event.id)).subscribe((response) => {
        //     this.provincias = response;
        // });
    }

    changeProvincia(event) {
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
        // this.ubigeoService
        //     .getHijos(Number(event.id))
        //     .subscribe((response) => (this.distritos = [{ id: '', text: 'Seleccione Distrito' }, ...response]));
        // this.ubigeoService.getHijos(Number(event.id)).subscribe((response) => (this.distritos = response));
        this.getDistritos(event.id);
    }

    changeDistrito(event) {
        this.formularioCliente.patchValue({
            idUbigeo: event.id,
        });
    }

    getProvincias(id) {
        this.ubigeoService.getHijos(id).subscribe((response) => {
            this.provincias = response;
        });
    }

    getDistritos(id) {
        this.ubigeoService.getHijos(id).subscribe((response) => (this.distritos = response));
    }

    guardarCliente() {
        if (this.idCliente) {
            this.clienteService.putCliente(this.idCliente, this.formularioCliente.value).subscribe(
                (response) => {
                    this.msj$ = this.mensajeResponse.succes('Cliente actualizado correctamente').subscribe((action) => {
                        if (action) {
                            this.atras();
                        }
                    });
                },
                (error) => {
                    console.log(error);
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
            console.log(this.formularioCliente.value);
        } else {
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
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.clientes.init}`]);
    }
}
