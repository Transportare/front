import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_OPERACIONES_TRACKING } from '@routes/rutas-operaciones';

@Component({
    selector: 'app-ruta',
    templateUrl: './ruta.component.html',
})
export class RutaComponent implements OnInit {
    loading: boolean;
    selectItem: any;
    data: any[];
    pagina: number;
    filas: number;
    constructor(private router: Router) {
        this.loading = false;
        this.selectItem = {};
        this.data = [];
        this.pagina = 1;
        this.filas = 10;
    }

    ngOnInit(): void {
        this.listar();
    }

    listar() {
        this.data = [
            {
                id: 1,
                guia: 'LIM-HRZ0001',
                tipo: 'Tipo 1',
                courier: 'Courier 1',
                fecha_ruta: '12/08/20',
                total: '10',
                peso: '5kg',
                estado: 'En Proceso',
            },
        ];
    }

    detalle() {}

    tracking() {}

    nuevo() {
        this.router.navigate([`${RUTAS_OPERACIONES_TRACKING.ruta.init}/${RUTAS_OPERACIONES_TRACKING.ruta.nuevo}`]);
    }
}
