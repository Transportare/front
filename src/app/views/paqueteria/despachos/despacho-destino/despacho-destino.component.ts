import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { Grupo, Manifiesto } from '@models/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PdfMakeService } from '@services/utils/pdfmake.service';
import { Router } from '@angular/router';
import { RUTAS_PAQUETERIA_MANTENIMIENTOS } from '@routes/rutas-paqueteria';

@Component({
    selector: 'app-despacho-destino',
    templateUrl: './despacho-destino.component.html',
    styles: [],
})
export class DespachoDestinoComponent implements OnInit, OnDestroy {
    loading: boolean;
    choferes: Grupo[];
    choferSelected: Grupo;
    vehiculos: any[];
    vehiculoSelected: any;
    sucursales: Grupo[];
    sucursalSelected: Grupo;
    selectItem: any;
    msj$: Subscription;
    form: FormGroup;
    manifiesto: Manifiesto;
    data: any[];
    repetido: boolean;
    numero: string;
    errorCodigo: { error: boolean; mensaje: string };
    @ViewChild('codigoBarra', { static: false }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private manifiestoService: ManifiestoService,
        private fb: FormBuilder,
        private pdfMakeService: PdfMakeService,
        private router: Router
    ) {
        this.loading = false;
        this.choferes = [];
        this.choferSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.vehiculos = [];
        this.errorCodigo = { error: false, mensaje: '' };
        this.vehiculoSelected = { id: '', text: 'Seleccione' };
        this.sucursales = [];
        this.sucursalSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.selectItem = {};
        this.numero = '';
        this.repetido = false;
        this.data = [];
    }

    ngOnInit(): void {
        this.initForm();
        this.manifiestoService.getData().subscribe((response) => {
            this.choferes = response.choferes;
            this.sucursales = response.sucursales;
        });
        this.getDetalle();
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    initForm() {
        this.form = this.fb.group({
            idChofer: ['', Validators.required],
            idVehiculo: [null],
            fechaSalida: [moment().format('yyyy-MM-DD'), Validators.required],
            idSucursal: ['', Validators.required],
            observacion: [''],
        });
    }

    getDetalle() {
        this.loading = true;
        try {
            this.manifiestoService.getCargosUserTemp().subscribe((response) => {
                this.data = response;
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
        }
    }

    agregar() {
        if (this.codigoBarra.nativeElement.value.length <= 0) {
            return;
        }

        if (this.data.findIndex((element) => element.codigo === this.codigoBarra.nativeElement.value) !== -1) {
            this.numero = this.codigoBarra.nativeElement.value;
            this.repetido = true;
            this.codigoBarra.nativeElement.blur();
        } else {
            this.repetido = false;
            this.manifiestoService
                .postCargo({
                    // idGuia: this.id,
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
                    (error) => {}
                );
        }
        this.codigoBarra.nativeElement.value = '';
    }

    deleteCargo(id, index) {
        this.manifiestoService.deleteCargo(id).subscribe(
            async (response) => {
                this.data.splice(index, 1);
            },
            (error) => {}
        );
    }

    guardar() {
        const data = {
            idPersonal: this.form.value.idChofer,
            fechaSalida: this.form.value.fechaSalida,
            idSucursalDestino: this.form.value.idSucursal,
            idVehiculo: this.form.value.idVehiculo,
            observacion: this.form.value.observacion,
        };

        this.manifiestoService.postCargoDefinitivo(data).subscribe(
            (response: any) => {
                this.msj$ = this.msj.succes('Guia creada correctamente').subscribe((action) => {
                    if (action) {
                        this.imprimirCargos(response.data);
                        this.router.navigate([`${RUTAS_PAQUETERIA_MANTENIMIENTOS.manifiestos.init}`]);
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

        this.pdfMakeService.generarPdfCargos({ cabecera, cargos });
    }
}
