import { Component, OnInit, OnDestroy } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
import { ManifiestoService } from '@services/modulos/operaciones/paqueteria/manifiestos/manifiestos.service';
import { Grupo } from '@models/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-salida-retorno',
    templateUrl: './salida-retorno.component.html',
    styles: [],
})
export class SalidasRetornoComponent implements OnInit, OnDestroy {
    loading: boolean;
    choferes: Grupo[];
    choferSelected: Grupo;
    vehiculos: any[];
    vehiculoSelected: any;
    sucursales: Grupo[];
    sucursalSelected: Grupo;
    selectItem: any;
    msj$: Subscription;
    form: FormGroup;

    constructor(
        private msj: MensajeResponseService,
        private router: Router,
        private manifiestoService: ManifiestoService,
        private fb: FormBuilder
    ) {
        this.loading = false;
        this.choferes = [];
        this.choferSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.vehiculos = [];
        this.vehiculoSelected = { id: '', text: 'Seleccione' };
        this.sucursales = [];
        this.sucursalSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.selectItem = {};
    }

    ngOnInit(): void {
        this.initForm();
        this.manifiestoService.getData().subscribe((response) => {
            this.choferes = response.choferes;
            this.sucursales = response.sucursales;
        });
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    initForm() {
        this.form = this.fb.group({
            idChofer: ['', Validators.required],
            idVehiculo: [null],
            fechaSalida: ['', Validators.required],
            idSucursal: ['', Validators.required],
            observacion: [''],
        });
    }

    guardar() {
        const route = RUTAS_OPERACIONES_PAQUETERIA;
        this.manifiestoService.postManifiesto(this.form.value).subscribe(
            (response: any) => {
                this.msj$ = this.msj.succes('Guia creada correctamente').subscribe((action) => {
                    if (action) {
                        const id = response.idGuia;
                        this.router.navigate([`${route.manifiestos.init}/${route.manifiestos.nuevo}/${id}/${route.manifiestos.cargos}`]);
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
