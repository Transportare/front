import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RUTAS_OPERACIONES_TRACKING } from '@routes/rutas-operaciones';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    msj$: Subscription;
    loading: boolean;
    sucursales: any[];
    sucursalSelected: any;
    tipoPaquetes: any[];
    tipoPaqueteSelected: any;
    distritos: any[];
    distritoSelected: any;
    domicilio: boolean;

    constructor(private router: Router, private activatedRouter: ActivatedRoute) {
        this.loading = false;
        this.sucursales = [];
        this.sucursalSelected = { id: '', text: 'Seleccione Sucursal' };
        this.tipoPaquetes = [];
        this.tipoPaqueteSelected = { id: '', text: 'Seleccione Tipo' };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione Distrito' };
        this.domicilio = false;
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    changeTipoEntrega(event) {
        console.log(event.target.checked);
        this.domicilio = event.target.checked;
    }

    atras() {
        this.router.navigate([`${RUTAS_OPERACIONES_TRACKING.ruta.init}`]);
    }
}
