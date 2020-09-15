import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { FileItem } from '@models/index';
import { CargaDatosService } from '@services/modulos/gestion/procesos/carga-datos/carga-datos.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormControl } from '@angular/forms';
declare var $: any;

@Component({
    selector: 'app-orden-servicio',
    templateUrl: './carga-datos.component.html',
    styleUrls: ['./carga-datos.component.scss'],
})
export class CargaDatosComponent implements OnInit, OnDestroy {
    loading: boolean;
    msj$: Subscription;
    archivo: FileItem[];
    estaSobre: boolean;
    error: { status: boolean; message: string };
    codigo: FormControl;
    cliente: FormControl;
    servicio: FormControl;
    habilitar: boolean;
    @ViewChild('modalCarga', { static: false }) modalCarga: ElementRef;

    constructor(private router: Router, private mensajeResponse: MensajeResponseService, private cargarDatosService: CargaDatosService) {
        this.loading = false;
        this.habilitar = false;
        this.estaSobre = false;
        this.archivo = [];
        this.codigo = new FormControl('');
        this.cliente = new FormControl({ value: '', disabled: true });
        this.servicio = new FormControl({ value: '', disabled: true });
        this.error = { status: false, message: '' };
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    verificarCodigo() {
        const value: string = this.codigo.value;

        if (value.length === 0 || isNaN(Number(value))) {
            return;
        }

        this.cargarDatosService.getOrdenServicio(value).subscribe(
            (response) => {
                if (response.succes) {
                    this.habilitar = true;
                    this.cliente.setValue(response.data);
                } else {
                    this.habilitar = false;
                    this.msj$ = this.mensajeResponse.danger(response.mensaje).subscribe();
                    this.cliente.setValue('');
                }

                this.codigo.setValue('');
            },
            (error) => {
                this.msj$ = this.mensajeResponse.danger('Ocurrio un error.').subscribe();
            }
        );
    }

    abrirCarga() {
        $(this.modalCarga.nativeElement).modal('show');
    }

    cerrarCarga() {
        $(this.modalCarga.nativeElement).modal('hide');
        this.deleteFile();
    }

    deleteFile() {
        this.archivo = [];
        this.error = { message: '', status: false };
    }

    guardarCarga() {
        if (!this.archivo[0]) return;
        $(this.modalCarga.nativeElement).modal('hide');
        this.infoResponse('', 'Espere por favor', 'info');

        this.cargarDatosService.postCargarDatos(this.archivo[0].archivo).subscribe(
            (response: any) => {
                if (response.succes) {
                    console.log(response);
                    Swal.close();
                    this.msj$ = this.mensajeResponse.succes(response.message).subscribe((action) => {
                        if (action) this.cerrarCarga();
                    });
                }
            },
            (error: any) => {
                console.log(error);
                Swal.close();
                this.msj$ = this.mensajeResponse.danger(error.error.message).subscribe((action) => {
                    if (action) this.cerrarCarga();
                });
            }
        );
    }

    private infoResponse(texto: string, titulo: string, action: SweetAlertIcon) {
        Swal.fire({
            icon: action,
            title: titulo,
            text: texto,
            onBeforeOpen: () => {
                Swal.showLoading();
            },
            allowEscapeKey: false,
            allowOutsideClick: false,
        });
    }

    onFileChange(event) {
        const file: FileList = event.target.files;

        if (!file[0]) return;

        if (file[0].name.toLocaleLowerCase().split('.').pop() !== 'csv') {
            this.error = { message: 'Solo se aceptan archivos con formato csv.', status: true };
            return;
        } else {
            this.error = { message: 'Archivo cargado correctamente.', status: false };
            this.archivo[0] = new FileItem(file[0]);
        }
    }

    validacionArchivos(event) {
        this.error = event;
    }
}
