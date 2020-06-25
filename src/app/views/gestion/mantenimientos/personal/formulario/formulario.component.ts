import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PersonalService } from '@services/modulos/gestion/mantenimientos/personal/personal.service';
import { Grupo } from '@models/grupo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Ubigeo } from '@models/ubigeo';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    data: any[];
    generos: Grupo[];
    generoSelected: Grupo;
    estadosCiviles: Grupo[];
    estadoSelected: Grupo;
    tipoPerfiles: Grupo[];
    tipoSelected: Grupo;
    departamentos: Ubigeo[];
    departamentoSelected: Ubigeo;
    provincias: Ubigeo[];
    selectedProvincia: Ubigeo;
    distritos: Ubigeo[];
    selectedDistrito: Ubigeo;
    idPersonal: number;
    formPersonal: FormGroup;

    constructor(
        private router: Router,
        private personalService: PersonalService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private ubigeoService: UbigeoService
    ) {
        this.initData();
        this.initForm();
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.idPersonal = Number(params.id);
            } else {
                this.listarSelects();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    initData() {
        this.generos = [];
        this.estadosCiviles = [];
        this.tipoPerfiles = [];
        this.departamentos = [];
        this.generoSelected = { id: 0, text: 'Seleccione Género', grupo: '' };
        this.estadoSelected = { id: 0, text: 'Seleccione Estado', grupo: '' };
        this.tipoSelected = { id: 0, text: 'Seleccione Tipo', grupo: '' };
        this.departamentoSelected = { id: '', text: 'Seleccione Departamento', padre: '' };
        this.provincias = [];
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia', padre: '' };
        this.distritos = [];
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito', padre: '' };
    }

    initForm() {
        this.formPersonal = this.fb.group({
            idUbigeo: ['', Validators.required],
            nombres: ['', Validators.required],
            apellidos: ['', Validators.required],
            dni: ['', Validators.required],
            fecNacimiento: ['', Validators.required],
            direccion: ['', Validators.required],
            idGenero: ['', Validators.required],
            idEstadoCivil: ['', Validators.required],
            telefono: ['', Validators.required],
            fecIngreso: ['', Validators.required],
            idTipoPersonal: ['', Validators.required],
        });
    }

    listarSelects() {
        this.personalService.getSelectsDePersonales().subscribe((response) => {
            this.generos = response.generos;
            this.estadosCiviles = response.estadosCiviles;
            this.tipoPerfiles = response.tipoPersonales;
            this.departamentos = response.departamentos;
        });
    }

    generoChange(event) {
        this.formPersonal.patchValue({
            idGenero: event.id,
        });
    }

    estadoCivilChange(event) {
        this.formPersonal.patchValue({
            idEstadoCivil: event.id,
        });
    }

    tipoChange(event) {
        this.formPersonal.patchValue({
            idTipoPersonal: event.id,
        });
    }

    // Ubigeo

    changeDepartamento(event) {
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia', padre: '' };
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.distritos = [];
        this.getProvincias(event.id);
    }

    changeProvincia(event) {
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.getDistritos(event.id);
    }

    changeDistrito(event) {
        this.formPersonal.patchValue({
            idUbigeo: event.id,
        });
    }

    getProvincias(id) {
        this.ubigeoService.getHijos(id).subscribe((response) => {
            this.provincias = response;
        });
    }

    getDistritos(id) {
        this.ubigeoService.getHijos(id).subscribe((response) => (this.distritos = response));
    }

    //

    guardarPersonal() {
        console.log(this.formPersonal.value);
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}`]);
    }
}
