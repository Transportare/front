import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RUTAS_PAQUETERIA_DESPACHOS } from '@routes/rutas-paqueteria';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '@services/utils/sucursales.service';
import { RutaService } from '@services/modulos/operaciones/paqueteria/ruta/ruta.service';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Ubigeo, Grupo } from '@models/index';
import { distinctUntilChanged } from 'rxjs/operators';
import { separadorMiles } from '@utils/validar-formatos';
import { PdfMakeService } from '@services/utils/pdfmake.service';

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    msj$: Subscription;
    loading: boolean;
    sucursales: any[];
    sucursalSelected: any;
    tipoPaquetes: Grupo[];
    tipoPaqueteSelected: Grupo;
    distritos: Ubigeo[];
    distritoSelected: Ubigeo;
    distritosRemitente: Ubigeo[];
    distritoSelectedRemitente: Ubigeo;
    domicilio: boolean;
    recojo: boolean;
    paquetes: any[];
    formRegistro: FormGroup;
    nombreSucursal: string;
    persona: boolean;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private sucursalesService: SucursalesService,
        private rutaService: RutaService,
        private tablaGeneralService: TablaGeneralService,
        private msj: MensajeResponseService,
        private pdfMakeService: PdfMakeService
    ) {
        this.loading = false;
        this.sucursales = [];
        this.sucursalSelected = { id: '', text: 'Seleccione Sucursal' };
        this.tipoPaquetes = [];
        this.tipoPaqueteSelected = { id: 0, text: 'Seleccione Tipo', grupo: '' };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.distritosRemitente = [];
        this.distritoSelectedRemitente = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.domicilio = false;
        this.recojo = false;
        this.persona = false;
        this.paquetes = [];
        this.initForm();
        this.revisarDni();
        this.getPrecio();
        const sucursal = localStorage.getItem('sucursal');
        this.rutaService.getDistrito(Number(sucursal)).subscribe((response) => {
            this.distritosRemitente = response;
        });
    }

    ngOnInit(): void {
        this.sucursalesService.getAllSucursales().subscribe((response) => {
            this.sucursales = response;
        });
        const sucursal = this.sucursalesService.getSucursalCompleta();
        this.nombreSucursal = sucursal.text;
        this.tablaGeneralService.getSelectPorGrupo(12).subscribe((response) => {
            this.tipoPaquetes = response;
        });
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    initForm() {
        this.formRegistro = this.fb.group({
            dni: [null, [Validators.required, Validators.minLength(8)]],
            nombres: [{ value: null, disabled: true }, Validators.required],
            apellidos: [{ value: null, disabled: true }, Validators.required],
            // direccion: [{ value: null, disabled: true }],

            idUbigeoRecojo: [null],
            direccionRecojo: [null],
            referenciaRecojo: [null],

            razonSocial: [{ value: null, disabled: true }],

            dniDestinatario: [null],
            idSucursalDestino: [null, Validators.required],
            nombreDestinatario: [null, Validators.required],
            apellidoDestinatario: [null, Validators.required],
            telefonoDestinatario: [null],
            claveDestinatario: [null, Validators.required],
            idUbigeoDestino: [null],
            direccionDestino: [null],
            referenciaDestino: [null],

            cantidadPaquetes: [null, Validators.required],
            pesoTotal: [null, Validators.required],
            idTipoPaquete: [null, Validators.required],
            precio: [{ value: null, disabled: true }, Validators.required],
            descripcionPaquete: [null],
            pagaDestino: [false],
        });
    }

    get destintarioDni() {
        return (
            this.formRegistro.get('dniDestinatario').invalid &&
            this.formRegistro.get('dniDestinatario').touched &&
            this.formRegistro.get('dniDestinatario').value.length !== 0
        );
    }

    getPrecio() {
        this.formRegistro.get('pesoTotal').valueChanges.subscribe((value: string) => {
            const precioBase = 10;
            const precioUnitario = 1;
            const valor = Number(value.split(',').join(''));
            const precio = valor === 0 ? 10 : Math.ceil(precioBase + (valor - 1) * precioUnitario);
            this.formRegistro.patchValue({
                precio: separadorMiles(precio),
            });
        });
    }

    revisarDni() {
        this.formRegistro
            .get('dniDestinatario')
            .valueChanges.pipe(distinctUntilChanged())
            .subscribe((value: string) => {
                if (value.length === 0) {
                    this.formRegistro.get('claveDestinatario').setValidators(Validators.required);
                    this.formRegistro.get('dniDestinatario').clearValidators();
                } else {
                    this.formRegistro.get('claveDestinatario').clearValidators();
                    this.formRegistro.get('dniDestinatario').setValidators([Validators.required, Validators.minLength(8)]);
                }

                this.formRegistro.get('dniDestinatario').updateValueAndValidity();
                this.formRegistro.get('claveDestinatario').updateValueAndValidity();
            });
    }

    changeTipoPersona(event) {
        this.persona = event.target.checked;
        this.formRegistro.patchValue({
            dni: '',
            razonSocial: '',
            nombres: '',
            apellidos: '',
        });
        if (this.persona) {
            this.formRegistro.get('dni').setValidators([Validators.required, Validators.minLength(11)]);
            this.formRegistro.get('razonSocial').setValidators(Validators.required);
            this.formRegistro.get('razonSocial').disable();
            this.formRegistro.get('nombres').clearValidators();
            this.formRegistro.get('apellidos').clearValidators();
        } else {
            this.formRegistro.get('dni').setValidators([Validators.required, Validators.minLength(8)]);
            this.formRegistro.get('razonSocial').clearValidators();
            this.formRegistro.get('nombres').disable();
            this.formRegistro.get('apellidos').disable();
            this.formRegistro.get('nombres').setValidators(Validators.required);
            this.formRegistro.get('apellidos').setValidators(Validators.required);
        }
        this.formRegistro.get('dni').updateValueAndValidity();
        this.formRegistro.get('razonSocial').updateValueAndValidity();
        this.formRegistro.get('nombres').updateValueAndValidity();
        this.formRegistro.get('apellidos').updateValueAndValidity();
    }

    changeTipoEntrega(event) {
        this.domicilio = event.target.checked;
        if (this.domicilio) {
            this.formRegistro.get('idUbigeoDestino').setValidators(Validators.required);
            this.formRegistro.get('direccionDestino').setValidators(Validators.required);
            this.formRegistro.get('referenciaDestino').setValidators(Validators.required);
        } else {
            this.formRegistro.get('idUbigeoDestino').clearValidators();
            this.formRegistro.get('direccionDestino').clearValidators();
            this.formRegistro.get('referenciaDestino').clearValidators();
            this.formRegistro.patchValue({
                idUbigeoDestino: null,
                direccionDestino: null,
                referenciaDestino: null,
            });
        }
        this.formRegistro.get('idUbigeoDestino').updateValueAndValidity();
        this.formRegistro.get('direccionDestino').updateValueAndValidity();
        this.formRegistro.get('referenciaDestino').updateValueAndValidity();
    }

    changeRecojo({ target }: { target: HTMLInputElement }) {
        this.recojo = target.checked;
        if (this.recojo) {
            this.formRegistro.get('idUbigeoRecojo').setValidators(Validators.required);
            this.formRegistro.get('direccionRecojo').setValidators(Validators.required);
            this.formRegistro.get('referenciaRecojo').setValidators(Validators.required);
        } else {
            this.formRegistro.get('idUbigeoRecojo').clearValidators();
            this.formRegistro.get('direccionRecojo').clearValidators();
            this.formRegistro.get('referenciaRecojo').clearValidators();
            this.formRegistro.patchValue({
                idUbigeoRecojo: null,
                direccionRecojo: null,
                referenciaRecojo: null,
            });
        }
        this.formRegistro.get('idUbigeoRecojo').updateValueAndValidity();
        this.formRegistro.get('direccionRecojo').updateValueAndValidity();
        this.formRegistro.get('referenciaRecojo').updateValueAndValidity();
    }

    changeSucursal(event) {
        this.sucursalSelected = event;
        this.formRegistro.patchValue({
            idSucursalDestino: this.sucursalSelected.id,
            idUbigeoDestino: null,
        });
        this.distritoSelected = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.rutaService.getDistrito(this.sucursalSelected.id).subscribe((response) => {
            this.distritos = response;
        });
    }

    changeDistrito(event) {
        this.formRegistro.patchValue({
            idUbigeoDestino: event.id,
        });
    }

    guardar() {
        const data = {
            ...this.formRegistro.getRawValue(),
            pesoTotal: Number(this.formRegistro.getRawValue().pesoTotal.split(',').join('')),
            precio: Number(this.formRegistro.getRawValue().precio.split(',').join('')),
            pagaDestino: this.formRegistro.getRawValue().pagaDestino ? 1 : 0,
            nombres: this.formRegistro.getRawValue().nombres || this.formRegistro.getRawValue().razonSocial,
        };
        delete data.razonSocial;

        this.rutaService.postRuta(data).subscribe(
            (response: any) => {
                this.pdfMakeService.generarPdf(response.data);
                this.msj$ = this.msj.succes('Ruta creada correctamente').subscribe((action) => {
                    if (action) {
                        this.atras();
                    }
                });
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    verificarDni() {
        if (this.formRegistro.controls.dni.invalid) {
            return;
        }

        this.rutaService.getClientesDni(this.formRegistro.value.dni).subscribe((response: any) => {
            const data = response.data;
            if (data) {
                if (this.persona) {
                    this.formRegistro.patchValue({
                        razonSocial: data.Nombre,
                    });
                    this.formRegistro.get('razonSocial').clearValidators();
                    this.formRegistro.get('razonSocial').disable();
                } else {
                    this.formRegistro.patchValue({
                        nombres: data.Nombre,
                        apellidos: data.Apellidos,
                    });
                    this.formRegistro.get('nombres').clearValidators();
                    this.formRegistro.get('apellidos').clearValidators();
                    this.formRegistro.get('nombres').disable();
                    this.formRegistro.get('apellidos').disable();
                }
            } else {
                if (this.persona) {
                    this.formRegistro.patchValue({
                        razonSocial: '',
                    });
                    this.formRegistro.get('razonSocial').setValidators(Validators.required);
                    this.formRegistro.get('razonSocial').enable();
                } else {
                    this.formRegistro.patchValue({
                        nombres: '',
                        apellidos: '',
                    });
                    this.formRegistro.get('nombres').setValidators(Validators.required);
                    this.formRegistro.get('apellidos').setValidators(Validators.required);
                    this.formRegistro.get('nombres').enable();
                    this.formRegistro.get('apellidos').enable();
                }
            }
            this.formRegistro.get('nombres').updateValueAndValidity();
            this.formRegistro.get('apellidos').updateValueAndValidity();
            this.formRegistro.get('razonSocial').updateValueAndValidity();
        });
    }

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_DESPACHOS.ruta.init}`]);
    }
}
