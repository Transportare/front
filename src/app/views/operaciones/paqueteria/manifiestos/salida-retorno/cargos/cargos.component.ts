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
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

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
                this.listarCargos();
            }
        });
    }

    ngOnInit(): void {}

    listarCargos() {
        this.loading = true;
        this.manifiestoService.getCargosByGuia(this.id).subscribe(
            (response: any) => {
                this.data = response.data.map((item) => ({ id: item.IdCargo, codigo: item.CodigoBarra, estado: item.EstadoCargo }));
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

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
            this.manifiestoService
                .postCargo({
                    idGuia: this.id,
                    codigoBarra: this.codigoBarra.nativeElement.value,
                })
                .subscribe(
                    (response: any) => {
                        const data = response.data;
                        this.data.push({ id: data.idCargo, codigo: data.codigoBarra, estado: data.estadoCargo });
                        this.codigoBarra.nativeElement.focus();
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
        this.codigoBarra.nativeElement.value = '';
    }

    deleteCargo(id) {
        this.manifiestoService.deleteCargo(id).subscribe(
            (response) => {
                this.listarCargos();
            },
            (error) => {
                console.log(error);
            }
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
