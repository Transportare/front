import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Manifiesto, Grupo } from '@models/index';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DespachoService } from '@services/modulos/operaciones/despachos/despachos.service';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import { DescargoService } from '@services/modulos/operaciones/paqueteria/descargo/descargo.service';
import * as moment from 'moment';

@Component({
    selector: 'app-descargo-masivo',
    templateUrl: './descargo-masivo.component.html',
    styles: [],
})
export class DescargoMasivoComponent implements OnInit {
    loading: boolean;
    accion: boolean;
    data: any[];
    selectItem: any;
    msj$: Subscription;
    repetido: boolean;
    numero: string;
    id: string;
    manifiesto: Manifiesto;
    errorCodigo: { error: boolean; mensaje: string };
    @ViewChild('codigoBarra', { static: false }) codigoBarra: ElementRef;
    form: FormGroup;
    estados: Grupo[];
    detalles: Grupo[];
    estadoSelected: Grupo;
    detalleSelected: Grupo;

    constructor(
        private msj: MensajeResponseService,
        private descargoService: DescargoService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private tablaGeneralService: TablaGeneralService
    ) {
        this.loading = false;
        this.numero = '';
        this.accion = false;
        this.repetido = false;
        this.data = [];
        this.selectItem = {};
        this.errorCodigo = { error: false, mensaje: '' };
        this.estados = [];
        this.detalles = [];
        this.estadoSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.detalleSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.tablaGeneralService.getSelectPorGrupo(9).subscribe((response) => {
            this.estados = response;
            this.estados.splice(0, 2);
        });
        this.initForm();
    }

    ngOnInit(): void {
        this.listarCargos();
    }

    initForm() {
        this.form = this.fb.group({
            accion: [true],
            estadoId: ['', Validators.required],
            detalleId: [''],
            manifiesto: [''],
            fecha: [moment().format('yyyy-MM-DD'), Validators.required],
        });
    }

    changeEstado(event) {
        // Esta parte esta en duro desde la tabla General
        this.estadoSelected = event;
        this.form.patchValue({
            estadoId: this.estadoSelected.id,
            detalleId: '',
        });
        this.detalles = [];
        this.detalleSelected = { id: 0, text: 'Seleccione', grupo: '' };
        const id = this.estadoSelected.id === 93 ? 16 : this.estadoSelected.id === 94 ? 17 : null;
        if (id) {
            this.form.get('detalleId').setValidators(Validators.required);
            this.tablaGeneralService.getSelectPorGrupo(id).subscribe((response) => {
                this.detalles = response;
            });
        } else {
            this.form.get('detalleId').clearValidators();
            this.form.patchValue({
                detalleId: null,
            });
        }
        this.form.get('detalleId').updateValueAndValidity();
    }

    listarCargos() {
        this.descargoService.getCargosByGuia().subscribe((response) => {
            this.data = response;
        });
    }

    agregar() {
        if (this.codigoBarra.nativeElement.value.length <= 0) {
            return;
        }
        this.errorCodigo = { error: false, mensaje: '' };
        this.repetido = false;

        if (this.form.value.accion) {
            if (this.form.invalid) {
                // si es invalido el formulario no permitira agregar y mandara error desde fornt
                this.errorCodigo = { error: true, mensaje: 'La fecha o el estado no deben estar vacios' };
            } else {
                // Valdiar si esta repetido
                if (this.data.findIndex((element) => element.codigo === this.codigoBarra.nativeElement.value) !== -1) {
                    this.numero = this.codigoBarra.nativeElement.value;
                    this.repetido = true;
                    this.codigoBarra.nativeElement.blur();
                    // this.errorCodigo = { error: false, mensaje: '' };
                } else {
                    // this.repetido = false;
                    const cargo = {
                        codigoBarra: this.codigoBarra.nativeElement.value,
                        estado: this.form.value.estadoId,
                        detalleEstado: this.form.value.detalleId,
                        fecha: this.form.value.fecha,
                    };

                    this.descargoService.postCargo(cargo).subscribe(
                        (response: any) => {
                            if (!response.succes) {
                                this.errorCodigo = { error: true, mensaje: response.message };
                                this.codigoBarra.nativeElement.blur();
                            } else {
                                const data = response.data;
                                // this.errorCodigo = { error: false, mensaje: '' };
                                this.data.push({ id: data.idCargo, codigo: data.codigoBarra, estado: data.estadoCargo });
                                this.codigoBarra.nativeElement.focus();
                            }
                        },
                        (error) => {
                            this.msj$ = this.msj.danger().subscribe();
                        }
                    );
                }
            }
        } else {
            // this.repetido = false;
            this.errorCodigo = { error: false, mensaje: '' };
            this.descargoService.deleteByCodigo(this.codigoBarra.nativeElement.value).subscribe((response: any) => {
                if (!response.succes) {
                    this.errorCodigo = { error: true, mensaje: response.message };
                } else {
                    this.listarCargos();
                }
            });
        }

        this.codigoBarra.nativeElement.value = '';
    }

    deleteCargo(id, index) {
        this.descargoService.deleteCargo(id).subscribe(
            (response) => {
                this.data.splice(index, 1);
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    guardar() {
        this.descargoService.postDescargoRegistrado().subscribe(
            (response) => {
                this.msj$ = this.msj.succes('Descargo realizado correctamente').subscribe((action) => {
                    if (action) {
                        this.atras();
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