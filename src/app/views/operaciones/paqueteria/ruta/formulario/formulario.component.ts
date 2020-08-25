import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RUTAS_OPERACIONES_TRACKING } from '@routes/rutas-operaciones';
declare var $: any;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as jsBarcode from 'JsBarcode';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '@services/utils/sucursales.service';
import { RutaService } from '@services/modulos/operaciones/tracking/ruta/ruta.service';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Ubigeo, Grupo } from '@models/index';
import { distinctUntilChanged } from 'rxjs/operators';

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
    remitente: Remitente;
    destinatario: Destinatario;
    paquete: Paquete;
    nombreSucursal: string;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private sucursalesService: SucursalesService,
        private rutaService: RutaService,
        private tablaGeneralService: TablaGeneralService,
        private msj: MensajeResponseService
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
        this.remitente = { nombres: '', apellidos: '', direccion: '', localidad: '', sucursal: '' };
        this.destinatario = {
            nombres: '',
            apellidos: '',
            telefono: '',
            direccion: '',
            referencia: '',
            localidad: '',
            sucursal: '',
        };
        this.paquete = { codigo: '', cantidad: 0, peso: '' };
        this.initForm();
        this.revisarDni();
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
            // nombres: ['', Validators.required],
            // apellidos: ['', Validators.required],
            // direccion: ['', Validators.required],
            nombres: [{ value: '', disabled: true }, Validators.required],
            apellidos: [{ value: '', disabled: true }, Validators.required],
            direccion: [{ value: '', disabled: true }],

            dniDestinatario: [''],
            idSucursalDestino: ['', Validators.required],
            nombreDestinatario: ['', Validators.required],
            apellidoDestinatario: ['', Validators.required],
            telefonoDestinatario: [''],
            palabraClave: ['', Validators.required],
            idUbigeoDestino: [null],
            direccionDestino: [null],
            referenciaDestino: [null],

            cantidadPaquetes: ['', Validators.required],
            pesoTotal: ['', Validators.required],
            idTipoPaquete: ['', Validators.required],
            precio: ['', Validators.required],
            detalle: [''],
        });
    }

    get destintarioDni() {
        return (
            this.formRegistro.get('dniDestinatario').invalid &&
            this.formRegistro.get('dniDestinatario').touched &&
            this.formRegistro.get('dniDestinatario').value.length !== 0
        );
    }

    revisarDni() {
        this.formRegistro
            .get('dniDestinatario')
            .valueChanges.pipe(distinctUntilChanged())
            .subscribe((value: string) => {
                if (value.length === 0) {
                    this.formRegistro.get('palabraClave').setValidators(Validators.required);
                    this.formRegistro.get('dniDestinatario').clearValidators();
                } else {
                    this.formRegistro.get('palabraClave').clearValidators();
                    this.formRegistro.get('dniDestinatario').setValidators([Validators.required, Validators.minLength(8)]);
                }

                this.formRegistro.get('dniDestinatario').updateValueAndValidity();
                this.formRegistro.get('palabraClave').updateValueAndValidity();
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
            ...this.formRegistro.value,
            nombres: this.formRegistro.value.nombres || '',
            apellidos: this.formRegistro.value.apellidos || '',
            direccion: this.formRegistro.value.direccion || '',
        };

        this.rutaService.postRuta(data).subscribe(
            (response: any) => {
                this.destinatario = response.data.destinatario;
                this.remitente = response.data.remitente;
                this.paquete = response.data.paquete;
                this.generarPdf();
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

    generarCodigoBarra() {
        const canvas = document.createElement('canvas');
        const opts: jsBarcode.Options = { fontSize: 28, height: 70 };
        jsBarcode(canvas, `${this.paquete.codigo}`, opts);
        return canvas.toDataURL();
    }

    generarTicket() {
        for (let i = 1; i <= Number(this.paquete.cantidad); i++) {
            const element = {
                pageBreak: 'before',
                table: {
                    widths: ['auto', 120, 100],
                    body: [
                        [
                            {
                                text: `${this.remitente.sucursal}`,
                                bold: true,
                                fontSize: 25,
                                borderColor: ['#000000', '#000000', '#ffffff', '#000000'],
                            },
                            {},
                            {
                                text: `${this.destinatario.sucursal}`,
                                bold: true,
                                fontSize: 25,
                                alignment: 'right',
                                borderColor: ['#ffffff', '#000000', '#000000', '#000000'],
                            },
                        ],
                        [
                            { text: 'MV', bold: true },
                            { text: `Peso (Kg.): ${this.paquete.peso}`, bold: true },
                            { text: `Piezas: ${i} de ${this.paquete.cantidad}`, bold: true },
                        ],
                        [
                            {
                                text: 'REMITENTE',
                                fillColor: 'black',
                                color: '#fff',
                                bold: true,
                                colSpan: 3,
                                alignment: 'center',
                            },
                        ],
                        [{ text: `${this.remitente.nombres} ${this.remitente.apellidos}`, colSpan: 3 }],
                        [
                            {
                                text: 'DIRECCIÓN:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${this.remitente.direccion || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'LOCALIDAD:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'],
                            },
                            {
                                text: `${this.remitente.localidad}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#000000'],
                            },
                        ],
                        [
                            {
                                image: 'barcode',
                                width: 200,
                                alignment: 'center',
                                colSpan: 3,
                                borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            { text: 'PAQUETES', bold: true, borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'] },
                            {},
                            {
                                text: 'TERRESTRE',
                                bold: true,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#000000'],
                                alignment: 'right',
                            },
                        ],
                        [
                            {
                                text: 'DESTINATARIO',
                                fillColor: 'black',
                                color: '#fff',
                                bold: true,
                                colSpan: 3,
                                alignment: 'center',
                            },
                        ],
                        [{ text: `${this.destinatario.nombres} ${this.destinatario.apellidos}`, colSpan: 3 }],
                        [
                            {
                                text: 'DIRECCIÓN:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${this.destinatario.direccion || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'LOCALIDAD:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${this.destinatario.localidad || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'REFERENCIA:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'],
                            },
                            {
                                text: `${this.destinatario.referencia || '-'}`,
                                colSpan: 2,
                                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
                            },
                        ],
                        [
                            {
                                text: '',
                                colSpan: 3,
                                margin: [0, 20, 0, 20],
                            },
                        ],
                        [`${moment().format('yyyy-MM-DD')}`, { text: 'Firma Recepción', alignment: 'center' }, ''],
                    ],
                },
            };
            this.paquetes.push(element);
        }

        delete this.paquetes[0].pageBreak;
        return this.paquetes;
    }

    generarPdf() {
        const documentDefinition = {
            pageSize: {
                width: 393.6,
                height: 'auto',
            },
            content: this.generarTicket(),
            images: {
                barcode: this.generarCodigoBarra(),
            },
        };

        pdfMake.createPdf(documentDefinition).open();
    }

    verificarDni() {
        if (this.formRegistro.value.dni.length < 8) {
            return;
        }

        this.rutaService.getClientesDni(this.formRegistro.value.dni).subscribe((response: any) => {
            console.log(response);
            const data = response.data;
            console.log(data);
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
        this.router.navigate([`${RUTAS_OPERACIONES_TRACKING.ruta.init}`]);
    }
}

interface Remitente {
    sucursal: string;
    nombres: string;
    apellidos: string;
    localidad: string;
    direccion: string;
}

interface Destinatario {
    apellidos: string;
    nombres: string;
    localidad: string;
    telefono: string;
    direccion: string;
    referencia: string;
    sucursal: string;
}

interface Paquete {
    codigo: string;
    cantidad: number;
    peso: string;
}
