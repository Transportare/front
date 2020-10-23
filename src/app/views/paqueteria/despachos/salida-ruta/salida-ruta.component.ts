import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-salida-ruta',
    templateUrl: './salida-ruta.component.html',
    styles: [],
})
export class SalidaRutaComponent implements OnInit, OnDestroy {
    loading: boolean;
    accion: boolean;
    mensajeros: any[];
    mensajeroSelected: any;
    departamentos: any[];
    departamentoSelected: any;
    provincias: any[];
    provinciaSelected: any;
    distritos: any[];
    distritoSelected: any;
    data: any[];
    selectItem: any;
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

    constructor() {
        this.loading = false;
        this.accion = false;
        this.mensajeros = [];
        this.mensajeroSelected = { id: '', text: 'Seleccione' };
        this.departamentos = [];
        this.departamentoSelected = { id: '', text: 'Seleccione' };
        this.provincias = [];
        this.provinciaSelected = { id: '', text: 'Seleccione' };
        this.distritos = [];
        this.distritoSelected = { id: '', text: 'Seleccione' };
        this.data = [];
        this.selectItem = {};
    }

    ngOnInit(): void {}

    ngOnDestroy() {}

    changeAccion(event) {
        this.accion = Number(event) === 1 ? true : false;
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
