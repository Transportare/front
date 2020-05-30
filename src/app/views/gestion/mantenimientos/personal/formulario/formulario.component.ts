import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    data: any[];

    constructor(private router: Router) {}

    ngOnInit() {}

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}`]);
    }
}
