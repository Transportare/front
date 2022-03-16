import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Manifiesto, Grupo } from '@models/index';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DescargoMasivoService } from '@services/modulos/operaciones/despachos/descargo-masivo.service';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
import * as moment from 'moment';
import { TipoTemporal } from '@models/enum.interface';

@Component({
    selector: 'app-descargo-masivo',
    templateUrl: './descargo-masivo.component.html',
    styles: [],
})
export class DescargoMasivoComponent implements OnInit {
    loading: boolean;
    accion: boolean;
    data: any[];
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
        private descargoMasivoService: DescargoMasivoService,
        private router: Router,
        private fb: FormBuilder,
        private tablaGeneralService: TablaGeneralService
    ) {
        this.loading = false;
        this.numero = '';
        this.accion = false;
        this.repetido = false;
        this.data = [];
        this.errorCodigo = { error: false, mensaje: '' };
        this.estados = [];
        this.detalles = [];
        this.estadoSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.detalleSelected = { id: 0, text: 'Seleccione', grupo: '' };
        this.tablaGeneralService.getSelectPorGrupo(9).subscribe((response) => {
            this.estados = response;
            this.estados = this.estados.filter((estado) => estado.id !== 91 && estado.id !== 92);
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

    changeDetalle(event) {
        this.detalleSelected = event;
        this.form.patchValue({ detalleId: event.id });
    }

    listarCargos() {
        this.descargoMasivoService.getCargosByGuia(TipoTemporal.DESCARGO_MASIVA_MENSAJERIA_TEMPORAL).subscribe((response) => {
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
                } else {
                    const cargo = {
                        codigoBarra: this.codigoBarra.nativeElement.value,
                        fechaVisita: this.form.value.fecha,
                        estado: this.form.value.estadoId,
                        estadoTexto: this.estadoSelected.text,
                        detalleId: this.form.value.detalleId,
                        detalleTexto: this.detalleSelected.text,
                    };

                    this.descargoMasivoService.postCargo(cargo).subscribe(
                        (response: any) => {
                            if (!response.succes) {
                                this.errorCodigo = { error: true, mensaje: response.message };
                                this.codigoBarra.nativeElement.blur();
                            } else {
                                const data = response.data;
                                this.data.push({
                                    id: data.idCargo,
                                    codigo: data.codigoBarra,
                                    estado: data.estadoCargo,
                                    detalleTexto: data.detalleTexto,
                                    fechaVisita: data.fechaVisita,
                                });
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
            this.descargoMasivoService.deleteByCodigo(this.codigoBarra.nativeElement.value).subscribe((response: any) => {
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
        this.descargoMasivoService.deleteCargo(id).subscribe(
            (response) => {
                this.data.splice(index, 1);
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    guardar() {
        this.descargoMasivoService.postDescargoRegistrado().subscribe(
            (response) => {
                this.msj$ = this.msj.succes('Descargo masivo realizado correctamente').subscribe((action) => {
                    if (action) {
                        this.form.reset();
                        this.form.patchValue({
                            accion: true,
                            fecha: moment().format('yyyy-MM-DD'),
                        });
                        this.estadoSelected = { id: 0, text: 'Seleccione', grupo: '' };
                        this.detalleSelected = { id: 0, text: 'Seleccione', grupo: '' };
                        this.listarCargos();
                    }
                });
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }
}
