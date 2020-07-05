import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PersonalService } from '@services/modulos/gestion/mantenimientos/personal/personal.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UbigeoService } from '@services/utils/ubigeo.service';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Personal, Grupo, Ubigeo } from '@models/index';
import { SucursalesService } from '@services/utils/sucursales.service';
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
        private sucursalService: SucursalesService,
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
                this.sucursales = this.sucursalService.getSucursales();
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    changeData(event) {
        this.formPersonal.controls.sucursales.setValue(event);
    }

    obtenerPersonal() {
        this.loading = true;
        this.personalService.getOnePersonal(this.idPersonal).subscribe(
            (response) => {
                console.log(response);
                this.sucursales = this.sucursalService.getSucursales();
                const personal: Personal = response.personal;
                this.departamentos = response.departamentos;
                this.provincias = response.provincias;
                this.distritos = response.distritos;
                this.estadosCiviles = response.estadosCiviles;
                this.generos = response.generos;
                this.tipoPerfiles = response.tipoPersonales;
                this.codigoPersonal = personal.codigo;
                this.estadoSelected = response.estadosCiviles.find((estado) => estado.id === personal.idEstadoCivil);
                this.generoSelected = response.generos.find((genero) => genero.id === personal.idGenero);
                this.tipoSelected = response.tipoPersonales.find((tipo) => tipo.id === personal.idTipoPersonal);
                this.departamentoSelected = response.departamentos.find((departamento) => departamento.id === personal.idDepartamento);
                this.selectedProvincia = this.provincias.find((provincia) => provincia.id === personal.idProvincia);
                this.selectedDistrito = this.distritos.find((distrito) => distrito.id === personal.idUbigeo);
                this.activos = personal.sucursales;
                this.formPersonal.patchValue({
                    idUbigeo: personal.idUbigeo,
                    nombres: personal.nombres,
                    apellidos: personal.apellidos,
                    dni: personal.dni,
                    fecNacimiento: personal.fecNacimiento,
                    direccion: personal.direccion,
                    idGenero: personal.idGenero,
                    idEstadoCivil: personal.idEstadoCivil,
                    telefono: personal.telefono,
                    fecIngreso: personal.fecIngreso,
                    idTipoPersonal: personal.idTipoPersonal,
                    sucursales: personal.sucursales,
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
            const noSeleccionadas: any[] = this.sucursales
                .map((item) => {
                    return item.id.toString();
                })
                .filter((s) => !this.formPersonal.value.sucursales.includes(s));

            console.log({ ...this.formPersonal.value, noSeleccionadas });

            this.personalService.putPersonal(this.idPersonal, { ...this.formPersonal.value, noSeleccionadas }).subscribe(
                (response) => {
                    this.msj$ = this.mensajeResponse.succes('Personal actualizado correctamente').subscribe((action) => {
                        if (action) {
                            this.atras();
                        }
                    });
                },
                (error) => {
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
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
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        }
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}`]);
    }
}
