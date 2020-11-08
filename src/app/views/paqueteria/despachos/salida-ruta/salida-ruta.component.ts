import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { DescargoRutaService } from '@services/modulos/paqueteria/despachos/descargo-ruta/descargo-ruta.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Grupo, Ubigeo } from '@models/index';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-salida-ruta',
    templateUrl: './salida-ruta.component.html',
    styles: [],
})
export class SalidaRutaComponent implements OnInit, OnDestroy {
    loading: boolean;
    accion: boolean;
    mensajeros: Grupo[];
    mensajeroSelected: Grupo;
    departamentos: Ubigeo[];
    departamentoSelected: Ubigeo;
    provincias: Ubigeo[];
    provinciaSelected: Ubigeo;
    distritos: Ubigeo[];
    distritoSelected: Ubigeo;
    data: any[];
    selectItem: any;
    msj$: Subscription;
    form: FormGroup;
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private descargoRutaService: DescargoRutaService,
        private ubigeoService: UbigeoService,
        private formBuilder: FormBuilder
    ) {
        this.loading = false;
        this.accion = false;
        this.mensajeros = [];
        this.mensajeroSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.departamentos = [];
        this.departamentoSelected = { id: '', text: 'Seleccione', padre: null };
        this.provincias = [];
        this.provinciaSelected = { id: '', text: 'Seleccione', padre: null };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.data = [];
        this.selectItem = {};
    }

    ngOnInit(): void {
        this.initData();
        this.form = this.formBuilder.group({
            idPersonal: ['', Validators.required],
            fechaSalida: ['', Validators.required],
            fechaCierre: ['', Validators.required],
            idUbigeoDestino: ['', Validators.required],
        });
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    async initData() {
        this.loading = true;
        try {
            this.mensajeros = await this.descargoRutaService.getMensajero().toPromise();
            this.departamentos = await this.ubigeoService.getDepartamentos().toPromise();
            this.loading = false;
        } catch (error) {
            this.msj$ = this.msj.danger().subscribe();
            this.loading = false;
        }
    }

    changeAccion(event) {
        this.accion = Number(event) === 1 ? true : false;
    }

    changeDepartamento(event: Ubigeo) {
        this.provinciaSelected = { id: '', text: 'Seleccione', padre: null };
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.departamentoSelected = event;
        this.ubigeoService.getHijos(Number(this.departamentoSelected.id)).subscribe((response) => (this.provincias = response));
    }

    changeProvincia(event: Ubigeo) {
        this.distritoSelected = { id: '', text: 'Seleccione', padre: null };
        this.provinciaSelected = event;
        this.ubigeoService.getHijos(Number(this.provinciaSelected.id)).subscribe((response) => (this.distritos = response));
    }

    changeDistrito(event) {}

    changeFechaSalida(event) {
        this.form.patchValue({
            fechaSalida: moment(event).format('YYYY-MM-DD'),
        });
    }

    changeFechaCierre(event) {
        this.form.patchValue({
            fechaCierre: moment(event).format('YYYY-MM-DD'),
        });
    }

    agregar() {
        if (this.codigoBarra.nativeElement.value.length <= 0) {
            return;
        }
        this.data.push({ id: '', codigo: this.codigoBarra.nativeElement.value, estado: '' });
        this.codigoBarra.nativeElement.value = '';
        this.codigoBarra.nativeElement.focus();
    }

    atras() {}
}
