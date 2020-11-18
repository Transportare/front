import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_PAQUETERIA_DESPACHOS } from '@routes/rutas-paqueteria';
import { RutaService } from '@services/modulos/operaciones/paqueteria/ruta/ruta.service';
import { Cargo } from '@models/index';
import { PdfMakeService } from '@services/utils/pdfmake.service';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import * as moment from 'moment';
import { EstadoTracking } from '@models/enum.interface';
moment.locale('es');
declare var $: any;

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit, OnDestroy {
    data: Cargo;
    id: string;
    loading: boolean;
    msj$: Subscription;
    estadoTracking: any = EstadoTracking;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private rutaService: RutaService,
        private pdfMakeService: PdfMakeService,
        private mensajeResponseService: MensajeResponseService
    ) {
        this.loading = false;
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.getDetalle();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    getDetalle() {
        this.loading = true;
        this.rutaService.getOneRuta(this.id).subscribe(
            (response) => {
                this.data = response;
                this.loading = false;
            },
            (error) => {
                this.mensajeResponseService.danger().subscribe();
                this.loading = false;
            }
        );
    }

    changeDate(date) {
        return date ? moment(date).format('dddd D, MMMM - h:mm A') : '-';
    }

    open() {
        this.pdfMakeService.generarPdf(this.data);
    }

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_DESPACHOS.ruta.init}`]);
    }
}
