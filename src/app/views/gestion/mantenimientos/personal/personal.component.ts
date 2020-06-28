import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PersonalService } from '@services/modulos/gestion/mantenimientos/personal/personal.service';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
})
export class PersonalComponent implements OnInit {
    selectItem: any;
    data: any[];
    loading: boolean;
    pagina: number;
    filas: number;

    constructor(private router: Router, private personalService: PersonalService) {
        this.selectItem = {};
        this.loading = false;
        this.data = [];
        this.pagina = 1;
        this.filas = 10;
    }

    ngOnInit() {
        this.listar();
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
                console.log(response);
                this.data = response.data;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}/${RUTAS_GESTION_MANTENIMIENTOS.personal.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.IdPersonal}/${route.personal.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.IdPersonal}/${route.personal.editar}`]);
    }
}
