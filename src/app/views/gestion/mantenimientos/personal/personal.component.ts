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

    constructor(private router: Router, private personalService: PersonalService) {
        this.selectItem = {};
        this.loading = false;
        this.data = [];
    }

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.loading = true;

        this.personalService.getPersonales().subscribe((response: any) => {
            console.log(response);
            this.data = response.data;
            this.loading = false;
        });
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}/${RUTAS_GESTION_MANTENIMIENTOS.personal.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.id}/${route.personal.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.id}/${route.personal.editar}`]);
    }
}
