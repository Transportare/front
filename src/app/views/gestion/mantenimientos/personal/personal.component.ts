import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PersonalService } from '@services/modulos/gestion/mantenimientos/personal/personal.service';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Personal } from '@models/index';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
})
export class PersonalComponent implements OnInit, OnDestroy {
    selectItem: Personal;
    data: Personal[];
    loading: boolean;
    pagina: number;
    filas: number;
    msj$: Subscription;

    constructor(private router: Router, private personalService: PersonalService, private mensajeResponse: MensajeResponseService) {
        this.selectItem = new Personal();
        this.loading = false;
        this.data = [];
        this.pagina = 1;
        this.filas = 10;
    }

    ngOnInit() {
        this.listar();
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    listar(pagina: number = 1) {
        this.loading = true;
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
        };

        this.personalService.getPersonales(params).subscribe(
            (response: any) => {
                this.data = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    delete() {
        this.msj$ = this.mensajeResponse.action('Se eliminara el personal permanentemente', true).subscribe((action) => {
            if (action) {
                this.personalService.deletePersonal(this.selectItem.idPersonal).subscribe(
                    (response) => {
                        this.msj$ = this.mensajeResponse.succes('Personal eliminado correctamente').subscribe((a) => {
                            if (a) {
                                this.listar();
                            }
                        });
                    },
                    (error) => {
                        this.msj$ = this.mensajeResponse.danger().subscribe();
                    }
                );
            }
        });
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}/${RUTAS_GESTION_MANTENIMIENTOS.personal.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.idPersonal}/${route.personal.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.idPersonal}/${route.personal.editar}`]);
    }
}
