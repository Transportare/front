import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { Servicio } from '@models/servicio';
import { ServiciosService } from '@services/modulos/gestion/mantenimientos/servicios/servicios.service';

@Component({
    selector: 'app-servicios',
    templateUrl: './servicios.component.html',
    styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
    selectItem: any;
    servicios: Servicio[];
    loading: boolean;

    constructor(private router: Router, private servicioService: ServiciosService) {
        this.selectItem = {};
        this.loading = false;
    }

    ngOnInit() {
        this.servicios = [];
        this.listar();
    }

    listar() {
        this.loading = true;
        this.servicioService.getServicios().subscribe(
            (response) => {
                this.servicios = response;
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.servicios.init}/${RUTAS_GESTION_MANTENIMIENTOS.servicios.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.id}/${route.servicios.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.servicios.init}/${this.selectItem.id}/${route.servicios.editar}`]);
    }
}
