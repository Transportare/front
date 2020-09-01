import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Manifiesto } from '@models/index';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';

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
    codigoEstado: any;
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
        this.codigoEstado = {};
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.id = params.id;
                this.getDetalle();
                // this.listarCargos();
            }
        });
    }

    ngOnInit(): void {}

    async listarCargos() {
        this.data = await this.manifiestoService.getCargosByGuia(this.id, { idEstado: this.manifiesto.idEstado }).toPromise();
    }

    async getDetalle() {
        this.loading = true;
        // this.manifiestoService.getOneManifiesto(this.id).subscribe(
        //     (response) => {
        //         this.manifiesto = response;
        //         this.loading = false;
        //     },
        //     (error) => {
        //         this.loading = false;
        //     }
        // );
        try {
            this.manifiesto = await this.manifiestoService.getOneManifiesto(this.id).toPromise();
            // this.data = await this.manifiestoService.getCargosByGuia(this.id, { idEstado: this.manifiesto.idEstado }).toPromise();
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
                        const data = response.data;
                        if (data.idCargo) {
                            this.data.push({ id: data.idCargo, codigo: data.codigoBarra, estado: data.estadoCargo });
                            this.codigoBarra.nativeElement.focus();
                            this.codigoEstado = {};
                        } else {
                            this.codigoBarra.nativeElement.blur();
                            this.codigoEstado = data;
                            // this.msj$ = this.msj.danger(`El codigo de barra tiene el estado: ${data.estadoCargo}`).subscribe();
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
                // await this.listarCargos();
                this.data.splice(index, 1);
            },
            (error) => {}
        );
    }

    guardar() {
        this.manifiestoService.postCargoDefinitivo({ idGuia: this.id }).subscribe(
            (response) => {
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

    atras() {
        this.router.navigate([`${RUTAS_OPERACIONES_PAQUETERIA.manifiestos.init}`]);
    }
}
