import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Manifiesto } from '@models/index';
import { RUTAS_PAQUETERIA_MANTENIMIENTOS } from '@routes/rutas-paqueteria';
import { PdfMakeService } from '@services/utils/pdfmake.service';

@Component({
    selector: 'app-salida-retorno',
    templateUrl: './cargos.component.html',
    styles: [],
})
export class CargosComponent implements OnInit, OnDestroy {
    loading: boolean;
    data: any[];
    selectItem: any;
    msj$: Subscription;
    id: string;
    action: string;
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
        this.data = [];
        this.selectItem = {};
        this.errorCodigo = { error: false, mensaje: '' };
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.action = params.action;
                this.getDetalle();
            }
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    async listarCargos() {
        this.data = await this.manifiestoService.getCargosByGuia(this.id).toPromise();
    }

    async getDetalle() {
        this.loading = true;
        try {
            this.manifiesto = await this.manifiestoService.getOneManifiesto(this.id).toPromise();
            await this.listarCargos();
            this.loading = false;
        } catch (error) {
            this.loading = false;
            this.msj$ = this.msj.danger().subscribe();
        }
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

    verificar() {
        if (this.codigoBarra.nativeElement.value.trim().length <= 0) {
            return;
        }

        const codigo = this.codigoBarra.nativeElement.value.trim();

        const codigoElegido = this.data.find((item) => item.codigo === codigo);
        if (codigoElegido) {
            codigoElegido.cheked = true;
            this.errorCodigo = { error: false, mensaje: '' };
            this.codigoBarra.nativeElement.focus();
        } else {
            this.errorCodigo = { error: true, mensaje: `El código '${codigo}' no existe en la lista actual.` };
            this.codigoBarra.nativeElement.blur();
        }
        this.codigoBarra.nativeElement.value = '';
    }

    validarProcesar(): boolean {
        const value = this.data.find((item) => !item.cheked);
        return !!value || this.data.length === 0;
    }

    procesar() {
        this.manifiestoService.postDescargoManifiesto({ idGuia: this.id }).subscribe(
            (response) => {
                this.msj$ = this.msj.succes('Desacargo masivo creado correctamente').subscribe((action) => {
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

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_MANTENIMIENTOS.manifiestos.init}`]);
    }
}
