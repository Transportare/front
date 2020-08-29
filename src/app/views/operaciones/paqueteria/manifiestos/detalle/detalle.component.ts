import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Manifiesto } from '@models/index';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';

@Component({
    selector: 'app-salida-retorno',
    templateUrl: './detalle.component.html',
    styles: [],
})
export class DetalleComponent implements OnInit {
    loading: boolean;
    accion: boolean;
    data: any[];
    selectItem: any;
    msj$: Subscription;
    repetido: boolean;
    numero: string;
    id: string;
    manifiesto: Manifiesto;
    @ViewChild('codigoBarra', { static: false }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private manifiestoService: ManifiestoService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.loading = false;
        this.numero = '';
        this.accion = false;
        this.repetido = false;
        this.data = [];
        this.selectItem = {};
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.getDetalle();
            }
        });
    }

    ngOnInit(): void {}

    getDetalle() {
        this.loading = true;
        this.manifiestoService.getOneManifiesto(this.id).subscribe(
            (response) => {
                this.manifiesto = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
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
            this.data.push({ id: '', codigo: this.codigoBarra.nativeElement.value, estado: '' });
            this.codigoBarra.nativeElement.focus();
        }
        this.codigoBarra.nativeElement.value = '';
    }

    atras() {
        this.router.navigate([`${RUTAS_OPERACIONES_PAQUETERIA.manifiestos.init}`]);
    }
}
