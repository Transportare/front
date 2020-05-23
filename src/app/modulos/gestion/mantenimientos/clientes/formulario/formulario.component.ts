import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, AfterViewInit, OnDestroy {
    data: any[];

    constructor(private router: Router) {}

    ngOnInit() {
        this.data = [
            {
                id: 0,
                text: 'Numero 1',
            },
            {
                id: 1,
                text: 'Carlos',
            },
            {
                id: 2,
                text: 'Mirella',
            },
            {
                id: 3,
                text: 'Josie',
            },
        ];
    }

    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip();
    }

    ngOnDestroy(): void {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.clientes.init}`]);
    }
}
