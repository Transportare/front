import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_PAQUETERIA_DESPACHOS } from '@routes/rutas-paqueteria';
import { RutaService } from '@services/modulos/operaciones/paqueteria/ruta/ruta.service';
import { Cargo } from '@models/index';
import { PdfMakeService } from '@services/utils/pdfmake.service';
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
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private rutaService: RutaService,
        private pdfMakeService: PdfMakeService
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
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    getDetalle() {
        this.loading = true;
        this.rutaService.getOneRuta(this.id).subscribe(
            (response) => {
                this.data = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    open() {
        this.pdfMakeService.generarPdf(this.data);
    }

    atras() {
        this.router.navigate([`${RUTAS_PAQUETERIA_DESPACHOS.ruta.init}`]);
    }
}
