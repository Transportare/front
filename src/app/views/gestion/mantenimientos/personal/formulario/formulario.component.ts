import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PersonalService } from '@services/modulos/gestion/mantenimientos/personal/personal.service';
import { Grupo } from '@models/grupo';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Ubigeo } from '@models/ubigeo';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
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
    sucursales: any[];
    loading: boolean;
    msj$: Subscription;
    activos: any[];
    codigoPersonal: string;

    constructor(
        private router: Router,
        private personalService: PersonalService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private ubigeoService: UbigeoService,
        private mensajeResponse: MensajeResponseService
    ) {
        this.initData();
        this.initForm();
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.idPersonal = Number(params.id);
                this.obtenerPersonal();
            } else {
                this.listarSelects();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    initData() {
        this.loading = false;
        this.generos = [];
        this.estadosCiviles = [];
        this.tipoPerfiles = [];
        this.departamentos = [];
        this.activos = [];
        this.generoSelected = { id: 0, text: 'Seleccione Género', grupo: '' };
        this.estadoSelected = { id: 0, text: 'Seleccione Estado', grupo: '' };
        this.tipoSelected = { id: 0, text: 'Seleccione Tipo', grupo: '' };
        this.departamentoSelected = { id: '', text: 'Seleccione Departamento', padre: '' };
        this.provincias = [];
        this.selectedProvincia = { id: '', text: 'Seleccione Provincia', padre: '' };
        this.distritos = [];
        this.selectedDistrito = { id: '', text: 'Seleccione Distrito', padre: '' };
        this.sucursales = [];
        this.codigoPersonal = '';
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
            sucursales: ['', Validators.required],
        });
    }

    listarSelects() {
        this.loading = true;
        this.personalService.getSelectsDePersonales().subscribe(
            (response) => {
                this.generos = response.generos;
                this.estadosCiviles = response.estadosCiviles;
                this.tipoPerfiles = response.tipoPersonales;
                this.departamentos = response.departamentos;
                this.sucursales = response.sucursales;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    changeData(event) {
        console.log(event);
        this.formPersonal.controls.sucursales.setValue(event);
    }

    obtenerPersonal() {
        this.loading = true;
        this.personalService.getOnePersonal(this.idPersonal).subscribe(
            (response) => {
                this.sucursales = response.sucursales;
                this.departamentos = response.departamentos;
                this.provincias = response.provincias;
                this.distritos = response.distritos;
                this.estadosCiviles = response.estadosCiviles;
                this.generos = response.generos;
                this.tipoPerfiles = response.tipoPersonales;
                this.codigoPersonal = response.personal.codigo;
                this.estadoSelected = response.estadosCiviles.find((estado) => estado.id === response.personal.idEstadoCivil);
                this.generoSelected = response.generos.find((genero) => genero.id === response.personal.idGenero);
                this.tipoSelected = response.tipoPersonales.find((tipo) => tipo.id === response.personal.idTipoPersonal);
                this.departamentoSelected = response.departamentos.find(
                    (departamento) => departamento.id === response.personal.idDepartamento
                );
                this.selectedProvincia = this.provincias.find((provincia) => provincia.id === response.personal.idProvincia);
                this.selectedDistrito = this.distritos.find((distrito) => distrito.id === response.personal.idUbigeo);
                this.activos = response.personal.sucursales;
                this.formPersonal.patchValue({
                    idUbigeo: response.personal.idUbigeo,
                    nombres: response.personal.nombres,
                    apellidos: response.personal.apellidos,
                    dni: response.personal.dni,
                    fecNacimiento: response.personal.fecNacimiento,
                    direccion: response.personal.direccion,
                    idGenero: response.personal.idGenero,
                    idEstadoCivil: response.personal.idEstadoCivil,
                    telefono: response.personal.telefono,
                    fecIngreso: response.personal.fecIngreso,
                    idTipoPersonal: response.personal.idTipoPersonal,
                    sucursales: response.personal.sucursales,
                });
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
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
        if (this.idPersonal) {
            console.log(this.formPersonal.value);
        } else {
            this.personalService.postPersonal({ ...this.formPersonal.value }).subscribe(
                (response) => {
                    this.msj$ = this.mensajeResponse.succes('Personal creado correctamente').subscribe((action) => {
                        if (action) {
                            this.atras();
                        }
                    });
                },
                (error) => {
                    console.log(error);
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}`]);
    }
}
