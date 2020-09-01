import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { SucursalesService } from '@services/utils/sucursales.service';
import { Cliente, Grupo, Ubigeo } from '@models/index';
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
    activos: string[];

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
        this.activos = [];
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
        this.activatedRouter.params.subscribe((params) => {
            if (params.id) {
                this.idCliente = Number(params.id);
                this.nuevo = false;
                this.obtenerCliente();
            } else {
                this.listarSelects();
            }
        });
    }

    initForm() {
        this.formularioCliente = this.fb.group({
            nombre: ['', Validators.required],
            ruc: ['', [Validators.required, Validators.minLength(11)]],
            direccion: ['', Validators.required],
            telefono: ['', Validators.minLength(7)],
            correo: ['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')],
            contacto: [''],
            idUbigeo: ['', Validators.required],
            rubro: [''],
            idTipoPago: ['', Validators.required],
            observacion: [''],
            sucursales: ['', Validators.required],
        });
    }

    get clienteRuc() {
        return this.formularioCliente.get('ruc').invalid && this.formularioCliente.get('ruc').touched;
    }

    get clienteTelefono() {
        return this.formularioCliente.get('telefono').invalid && this.formularioCliente.get('telefono').touched;
    }

    get clienteCorreo() {
        return this.formularioCliente.get('correo').invalid && this.formularioCliente.get('correo').touched;
    }

    changeData(event) {
        this.formularioCliente.controls.sucursales.setValue(event);
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
        this.sucursales = this.sucursaleService.getSucursales();
        this.loading = false;
    }

    obtenerCliente() {
        this.loading = true;
        this.clienteService.getUnCliente(this.idCliente).subscribe(
            (response) => {
                const cliente: Cliente = response.cliente;
                this.sucursales = this.sucursaleService.getSucursales();
                this.activos = cliente.sucursales;
                this.tipoPagos = response.tipoPagos;
                this.departamentos = response.departamentos;
                this.provincias = response.provincias;
                this.distritos = response.distritos;
                this.selectedDepartamento = this.departamentos.find((departamento: Ubigeo) => cliente.idDepartamento === departamento.id);
                this.selectedProvincia = this.provincias.find((provincia: Ubigeo) => cliente.idProvincia === provincia.id);
                this.selectedDistrito = this.distritos.find((distrito: Ubigeo) => cliente.idUbigeo === distrito.id);
                this.selectedPago = this.tipoPagos.find((pago: Grupo) => cliente.idTipoPago === pago.id);
                this.formularioCliente.patchValue({
                    nombre: cliente.nombre,
                    ruc: cliente.ruc,
                    direccion: cliente.direccion,
                    telefono: cliente.telefono,
                    correo: cliente.correo,
                    contacto: cliente.contacto,
                    rubro: cliente.rubro,
                    observacion: cliente.observacion,
                    idTipoPago: cliente.idTipoPago,
                    idUbigeo: cliente.idUbigeo,
                    sucursales: cliente.sucursales,
                });
                this.loading = false;
            },
            (error) => {
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
        this.getProvincias(event.id);
    }

    changeProvincia(event) {
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito' };
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
            const noSeleccionadas: any[] = this.sucursales
                .map((item) => {
                    return item.id.toString();
                })
                .filter((s) => !this.formularioCliente.value.sucursales.includes(s));
            this.clienteService.putCliente(this.idCliente, { ...this.formularioCliente.value, noSeleccionadas }).subscribe(
                (response) => {
                    this.msj$ = this.mensajeResponse.succes('Cliente actualizado correctamente').subscribe((action) => {
                        if (action) {
                            this.atras();
                        }
                    });
                },
                (error) => {
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
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
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.clientes.init}`]);
    }
}
