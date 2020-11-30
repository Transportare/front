import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Grupo, Ubigeo } from '@models/index';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { UbigeoService } from '@services/utils/ubigeo.service';
import * as moment from 'moment';
import { TipoTemporal } from '@models/enum.interface';
import { SalidaMasivaService } from '@services/modulos/operaciones/despachos/salida-masiva.service';

@Component({
    selector: 'app-salidas-masivo',
    templateUrl: './salidas-masivo.component.html',
    styles: [],
})
export class SalidasMasivoComponent implements OnInit, OnDestroy {
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
    msj$: Subscription;
    form: FormGroup;
    errorCodigo: { error: boolean; mensaje: string };
    repetido: boolean;
    numero: string;
    @ViewChild('codigoBarra', { static: true }) codigoBarra: ElementRef;

    constructor(
        private msj: MensajeResponseService,
        private salidaMasivaService: SalidaMasivaService,
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
        this.numero = '';
        this.repetido = false;
        this.errorCodigo = { error: false, mensaje: '' };
    }

    ngOnInit(): void {
        this.initData();
        this.form = this.formBuilder.group({
            idPersonal: ['', Validators.required],
            fechaSalida: [moment().format('YYYY-MM-DD'), Validators.required],
            fechaCierre: ['', Validators.required],
            idUbigeoDestino: ['', Validators.required],
            movilidad: [null],
            observacion: [null],
            accion: [true],
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
            this.mensajeros = await this.salidaMasivaService.getMensajero().toPromise();
            this.departamentos = await this.ubigeoService.getDepartamentos().toPromise();
            this.data = await this.salidaMasivaService.getCargosUserTemp(TipoTemporal.SALIDA_MASIVA_MENSAJERIA_TEMPORAL).toPromise();
            this.loading = false;
        } catch (error) {
            this.msj$ = this.msj.danger().subscribe();
            this.loading = false;
        }
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

    listar() {
        this.salidaMasivaService.getCargosUserTemp(TipoTemporal.SALIDA_MASIVA_MENSAJERIA_TEMPORAL).subscribe((r) => (this.data = r));
    }

    agregar() {
        if (this.codigoBarra.nativeElement.value.length <= 0) {
            return;
        }

        this.errorCodigo = { error: false, mensaje: '' };
        this.repetido = false;

        if (this.form.value.accion) {
            if (this.data.findIndex((element) => element.codigo === this.codigoBarra.nativeElement.value) !== -1) {
                this.numero = this.codigoBarra.nativeElement.value;
                this.repetido = true;
                this.codigoBarra.nativeElement.blur();
            } else {
                this.salidaMasivaService
                    .postSalidaMasivaTemporal({
                        codigoBarra: this.codigoBarra.nativeElement.value,
                    })
                    .subscribe(
                        (response: any) => {
                            if (!response.succes) {
                                this.errorCodigo = { error: true, mensaje: response.message };
                                this.codigoBarra.nativeElement.blur();
                            } else {
                                const data = response.data;
                                this.errorCodigo = { error: false, mensaje: '' };
                                this.data.push({ id: data.idCargo, codigo: data.codigoBarra, estado: data.estadoCargo });
                                this.codigoBarra.nativeElement.focus();
                            }
                        },
                        (error) => {
                            this.msj$ = this.msj.danger().subscribe();
                        }
                    );
            }
        } else {
            this.errorCodigo = { error: false, mensaje: '' };
            this.salidaMasivaService.deleteByCodigo(this.codigoBarra.nativeElement.value).subscribe((response: any) => {
                if (!response.succes) {
                    this.errorCodigo = { error: true, mensaje: response.message };
                } else {
                    this.listar();
                }
            });
        }

        this.codigoBarra.nativeElement.value = '';
    }

    deleteCargo(id, index) {
        this.salidaMasivaService.deleteCargo(id).subscribe(
            async (response) => {
                this.data.splice(index, 1);
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }

    guardar() {
        delete this.form.value.accion;
        const data = {
            ...this.form.value,
            movilidad: Number(this.form.value.movilidad.split(',').join('')),
        };

        this.salidaMasivaService.postSalidaMasiva(data).subscribe(
            (response: any) => {
                this.msj$ = this.msj.succes('Salida masiva correctamente').subscribe((action) => {
                    if (action) {
                        this.listar();
                    }
                });
            },
            (error) => {
                this.msj$ = this.msj.danger().subscribe();
            }
        );
    }
}
