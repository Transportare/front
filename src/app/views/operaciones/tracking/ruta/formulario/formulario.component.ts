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

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    msj$: Subscription;
    loading: boolean;
    sucursales: any[];
    sucursalSelected: any;
    tipoPaquetes: any[];
    tipoPaqueteSelected: any;
    distritos: any[];
    distritoSelected: any;
    domicilio: boolean;
    paquetes: any[];
    data: any;
    formRegistro: FormGroup;
    remitente: Remitente;
    destinatario: Destinatario;
    paquete: Paquete;

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
        this.tipoPaqueteSelected = { id: '', text: 'Seleccione Tipo' };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione Distrito' };
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
    }

    ngOnInit(): void {
        this.sucursales = this.sucursalesService.getSucursales();
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
            nombres: ['', Validators.required],
            apellidos: ['', Validators.required],
            direccion: ['', Validators.required],
            sucursalRemitente: [{ value: '', disabled: true }, Validators.required],

            dniDestinatario: ['', Validators.required],
            idSucursalDestino: ['', Validators.required],
            nombreDestinatario: ['', Validators.required],
            apellidoDestinatario: ['', Validators.required],
            telefonoDestinatario: ['', Validators.required],
            idUbigeoDestino: ['010101'],
            direccionDestino: [''],
            referenciaDestino: [''],

            cantidadPaquetes: ['', Validators.required],
            pesoTotal: ['', Validators.required],
            idTipoPaquete: ['', Validators.required],
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
        }
        this.formRegistro.get('idUbigeoDestino').updateValueAndValidity();
        this.formRegistro.get('direccionDestino').updateValueAndValidity();
        this.formRegistro.get('referenciaDestino').updateValueAndValidity();
        console.log(this.sucursalSelected);
    }

    changeSucursal(event) {
        this.sucursalSelected = event;
        this.formRegistro.patchValue({
            idSucursalDestino: this.sucursalSelected.id,
        });
    }

    guardar() {
        this.rutaService.postRuta(this.formRegistro.value).subscribe(
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
        jsBarcode(canvas, `${this.paquete.codigo}`);
        return canvas.toDataURL();
    }

    generarTicket() {
        console.log(this.paquete);
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
                                text: `${this.remitente.direccion}`,
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
                                text: `${this.destinatario.direccion}`,
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
                                text: `${this.destinatario.localidad}`,
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
                                text: `${this.destinatario.referencia}`,
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
