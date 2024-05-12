import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { SalidaRutaService } from '@services/modulos/paqueteria/despachos/salida-ruta/salida-ruta.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Grupo, Ubigeo, Manifiesto } from '@models/index';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TipoTemporal } from '@models/enum.interface';
import { PdfMakeService } from '@services/utils/pdfmake.service';

@Component({
    selector: 'app-salida-ruta',
    templateUrl: './salida-ruta.component.html',
    styles: [],
})
export class SalidaRutaComponent implements OnInit, OnDestroy {
    loading: boolean;
    accion: boolean;
    mensajeros: Grupo[];
    mensajeroSelected: Grupo;
    departamentos: Ubigeo[];
    departamentoSelected: Ubigeo;
    provincias: Ubigeo[];
    provinciaSelected: Ubigeo;
    distritos: Ubigeo[];
    distritoSelected: Ubigeo;
    data: any[];
    msj$: Subscription;
    form: FormGroup;
    errorCodigo: { error: boolean; mensaje: string };
    repetido: boolean;
    numero: string;
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private salidaRutaService: SalidaRutaService,
        private ubigeoService: UbigeoService,
        private formBuilder: FormBuilder,
        private pdfMakeService: PdfMakeService
    ) {
        this.loading = false;
        this.accion = false;
        this.mensajeros = [];
        this.mensajeroSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.departamentos = [];
        this.departamentoSelected = { id: '', text: 'Seleccione', padre: null };
        this.provincias = [];
        this.provinciaSelected = { id: '', text: 'Seleccione', padre: null };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.data = [];
        this.numero = '';
        this.repetido = false;
        this.errorCodigo = { error: false, mensaje: '' };
    }

    ngOnInit(): void {
        this.initData();
        this.form = this.formBuilder.group({
            idPersonal: ['', Validators.required],
            fechaSalida: [moment().format('YYYY-MM-DD'), Validators.required],
            fechaCierre: ['', Validators.required],
            idUbigeoDestino: ['', Validators.required],
            accion: [true],
        });
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    async initData() {
        this.loading = true;
        try {
            this.mensajeros = await this.salidaRutaService.getMensajero().toPromise();
            this.departamentos = await this.ubigeoService.getDepartamentos().toPromise();
            this.data = await this.salidaRutaService.getCargosUserTemp(TipoTemporal.SALIDA_RUTA_PAQUETERIA_TEMPORAL).toPromise();
            this.loading = false;
        } catch (error) {
            this.msj$ = this.msj.danger().subscribe();
            this.loading = false;
        }
    }

    changeDepartamento(event: Ubigeo) {
        this.provinciaSelected = { id: '', text: 'Seleccione', padre: null };
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.departamentoSelected = event;
        this.ubigeoService.getHijos(Number(this.departamentoSelected.id)).subscribe((response) => (this.provincias = response));
    }

    changeProvincia(event: Ubigeo) {
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.provinciaSelected = event;
        this.ubigeoService.getHijos(Number(this.provinciaSelected.id)).subscribe((response) => (this.distritos = response));
    }

    changeFechaSalida(event) {
        this.form.patchValue({
            fechaSalida: moment(event).format('YYYY-MM-DD'),
        });
    }

    changeFechaCierre(event) {
        this.form.patchValue({
            fechaCierre: moment(event).format('YYYY-MM-DD'),
        });
    }

    listar() {
        this.salidaRutaService.getCargosUserTemp(TipoTemporal.SALIDA_RUTA_PAQUETERIA_TEMPORAL).subscribe((r) => (this.data = r));
    }

    agregar() {
        if (this.codigoBarra.nativeElement.value.length <= 0) {
            return;
        }

        this.errorCodigo = { error: false, mensaje: '' };
        this.repetido = false;

        if (this.form.value.accion) {
            if (this.data.findIndex((element) => element.codigo === this.codigoBarra.nativeElement.value) !== -1) {
                this.numero = this.codigoBarra.nativeElement.value;
                this.repetido = true;
                this.codigoBarra.nativeElement.blur();
            } else {
                this.salidaRutaService
                    .postSalidaRutaTemporal({
                        codigoBarra: this.codigoBarra.nativeElement.value,
                    })
                    .subscribe(
                        (response: any) => {
                            if (!response.succes) {
                                this.errorCodigo = { error: true, mensaje: response.message };
                                this.codigoBarra.nativeElement.blur();
                            } else {
                                const data = response.data;
                                this.errorCodigo = { error: false, mensaje: '' };
                                this.data.push({ id: data.idCargo, codigo: data.codigoBarra, estado: data.estadoCargo });
                                this.codigoBarra.nativeElement.focus();
                            }
                        },
                        (error) => {
                            this.msj$ = this.msj.danger().subscribe();
                        }
                    );
            }
        } else {
            this.errorCodigo = { error: false, mensaje: '' };
            this.salidaRutaService.deleteByCodigo(this.codigoBarra.nativeElement.value).subscribe((response: any) => {
                if (!response.succes) {
                    this.errorCodigo = { error: true, mensaje: response.message };
                } else {
                    this.listar();
                }
            });
        }

        this.codigoBarra.nativeElement.value = '';
    }

    deleteCargo(id, index) {
        this.salidaRutaService.deleteCargo(id).subscribe(
            async (response) => {
                this.data.splice(index, 1);
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    guardar() {
        const formValues = { ...this.form.value };
        delete formValues.accion;

        this.salidaRutaService.postSalidaRuta(formValues).subscribe(
            (response: any) => {
                this.msj$ = this.msj.succes('Salida a ruta correctamente').subscribe((action) => {
                    if (action) {
                        this.imprimirCargos(response.data);
                        this.listar();
                    }
                });
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    imprimirCargos(data) {
        const cabecera: Manifiesto = {
            ...new Manifiesto(),
            idGuia: data.cabecera.IdGuia,
            personal: data.cabecera.Personal,
            fechaSalida: data.cabecera.FechaSalida,
            sucursalDestino: data.cabecera.SucursalDestino,
            sucursalRemitente: data.cabecera.SucursalRemite,
            idEstado: data.cabecera.IdEstadoGuia,
            estado: data.cabecera.Estado,
        };

        const cargos = data.detalle.map((item) => ({
            nombres: item.Nombre,
            apellidos: item.Apellidos,
            cantidadPaquetes: item.CantidadPaquetes,
            guiaOs: item.GuiaOs,
            idCliente: item.IdCliente,
            idOrdenServicio: item.IdOrdenServicio,
            idServicio: item.IdServicio,
            pagaDestino: item.PagaDestino,
            pesoTotal: item.PesoTotal,
        }));

        this.pdfMakeService.generarPdfCargos({ cabecera, cargos }, true, true);
    }
}
