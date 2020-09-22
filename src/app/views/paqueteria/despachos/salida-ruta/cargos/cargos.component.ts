import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Manifiesto } from '@models/index';
import { RUTAS_PAQUETERIA_DESPACHOS } from '@routes/rutas-paqueteria';
import { PdfMakeService } from '@services/utils/pdfmake.service';

@Component({
    selector: 'app-salida-retorno',
    templateUrl: './cargos.component.html',
    styles: [],
})
export class CargosComponent implements OnInit {
    loading: boolean;
    accion: boolean;
    data: any[];
    selectItem: any;
    msj$: Subscription;
    repetido: boolean;
    numero: string;
    id: string;
    manifiesto: Manifiesto;
    errorCodigo: { error: boolean; mensaje: string };
    @ViewChild('codigoBarra', { static: false }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private manifiestoService: ManifiestoService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pdfMakeService: PdfMakeService
    ) {
        this.loading = false;
        this.numero = '';
        this.accion = false;
        this.repetido = false;
        this.data = [];
        this.selectItem = {};
        this.errorCodigo = { error: false, mensaje: '' };
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.getDetalle();
            }
        });
    }

    ngOnInit(): void {}

    async listarCargos() {
        this.data = await this.manifiestoService.getCargosByGuia(this.id, { idEstado: this.manifiesto.idEstado }).toPromise();
    }

    async getDetalle() {
        this.loading = true;
        try {
            this.manifiesto = await this.manifiestoService.getOneManifiesto(this.id).toPromise();
            await this.listarCargos();
            this.loading = false;
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
                    idGuia: this.id,
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
        this.manifiestoService.postCargoDefinitivo({ idGuia: this.id }).subscribe(
            (response: any) => {
                const data = response.data;

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
                this.msj$ = this.msj.succes('Cargos asignados correctamente').subscribe((action) => {
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

    detalle() {
        this.manifiestoService.generarPdfManifiesto(this.id).subscribe((response: any) => {
            const { data, detalle } = response;

            const cabecera: Manifiesto = {
                ...new Manifiesto(),
                idGuia: data.IdGuia,
                personal: data.Personal,
                fechaSalida: data.FechaSalida,
                sucursalDestino: data.SucursalDestino,
                sucursalRemitente: data.SucursalRemite,
                idEstado: data.IdEstadoGuia,
                estado: data.Estado,
            };

            const cargos = detalle.map((item) => ({
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
        });
    }

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_DESPACHOS.salidaRuta.init}`]);
    }
}