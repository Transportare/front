import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-salida-retorno',
    templateUrl: './salida-retorno.component.html',
    styles: [],
})
export class SalidasRetornoComponent implements OnInit {
    loading: boolean;
    accion: boolean;
    choferes: any[];
    choferSelected: any;
    vehiculos: any[];
    vehiculoSelected: any;
    sucursales: any[];
    sucursalSelected: any;
    // distritos: any[];
    // distritoSelected: any;
    data: any[];
    selectItem: any;
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

    constructor() {
        this.loading = false;
        this.accion = false;
        this.choferes = [];
        this.choferSelected = { id: '', text: 'Seleccione' };
        this.vehiculos = [];
        this.vehiculoSelected = { id: '', text: 'Seleccione' };
        this.sucursales = [];
        this.sucursalSelected = { id: '', text: 'Seleccione' };
        // this.distritos = [];
        // this.distritoSelected = { id: '', text: 'Seleccione' };
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
