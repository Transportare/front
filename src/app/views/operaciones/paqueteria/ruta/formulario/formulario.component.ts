import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
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
    domicilio: boolean;
    paquetes: any[];
    formRegistro: FormGroup;
    nombreSucursal: string;

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
        this.domicilio = false;
        this.paquetes = [];
        this.initForm();
        this.revisarDni();
        this.getPrecio();
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
            dni: ['', Validators.required],
            nombres: [{ value: '', disabled: true }, Validators.required],
            apellidos: [{ value: '', disabled: true }, Validators.required],
            direccion: [{ value: '', disabled: true }],

            dniDestinatario: [''],
            idSucursalDestino: ['', Validators.required],
            nombreDestinatario: ['', Validators.required],
            apellidoDestinatario: ['', Validators.required],
            telefonoDestinatario: [''],
            claveDestinatario: ['', Validators.required],
            idUbigeoDestino: [null],
            direccionDestino: [null],
            referenciaDestino: [null],

            cantidadPaquetes: ['', Validators.required],
            pesoTotal: ['', Validators.required],
            idTipoPaquete: ['', Validators.required],
            precio: [{ value: '', disabled: true }, Validators.required],
            descripcionPaquete: [''],
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
        };

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
        if (this.formRegistro.value.dni.length < 8) {
            return;
        }

        this.rutaService.getClientesDni(this.formRegistro.value.dni).subscribe((response: any) => {
            const data = response.data;
            if (data) {
                this.formRegistro.patchValue({
                    nombres: data.Nombre,
                    apellidos: data.Apellidos,
                    direccion: data.Direccion,
                });
                this.formRegistro.get('nombres').disable();
                this.formRegistro.get('apellidos').disable();
                this.formRegistro.get('direccion').disable();
            } else {
                this.formRegistro.patchValue({
                    nombres: '',
                    apellidos: '',
                    direccion: '',
                });
                this.formRegistro.get('nombres').enable();
                this.formRegistro.get('apellidos').enable();
                this.formRegistro.get('direccion').enable();
            }
            this.formRegistro.get('nombres').updateValueAndValidity();
            this.formRegistro.get('apellidos').updateValueAndValidity();
            this.formRegistro.get('direccion').updateValueAndValidity();
        });
    }

    atras() {
        this.router.navigate([`${RUTAS_OPERACIONES_PAQUETERIA.ruta.init}`]);
    }
}
