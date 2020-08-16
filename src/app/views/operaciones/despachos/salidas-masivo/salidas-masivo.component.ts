import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-salidas-masivo',
    templateUrl: './salidas-masivo.component.html',
    styles: [],
})
export class SalidasMasivoComponent implements OnInit {
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
