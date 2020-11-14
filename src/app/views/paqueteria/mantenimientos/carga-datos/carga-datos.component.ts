import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { FileItem, Grupo } from '@models/index';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CargaDatosService } from '@services/modulos/paqueteria/mantenimientos/carga-datos.service';
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
    clientes: Grupo[];
    clienteSelected: Grupo;
    accepts: string[];
    @ViewChild('modalCarga', { static: false }) modalCarga: ElementRef;

    constructor(private router: Router, private mensajeResponse: MensajeResponseService, private cargarDatosService: CargaDatosService) {
        this.loading = false;
        this.estaSobre = false;
        this.archivo = [];
        this.clientes = [];
        this.clienteSelected = { id: null, text: 'Seleccione', grupo: '' };
        this.error = { status: false, message: '' };
        this.accepts = ['xls', 'xlsx'];
        this.cargarDatosService.getClientes().subscribe((response) => (this.clientes = response));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
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
        const formData = new FormData();
        formData.append('archivo', this.archivo[0].archivo);
        formData.append('idCliente', this.clienteSelected.id.toString());
        this.cargarDatosService.postCargaDatos(formData).subscribe(
            (response: any) => {
                if (response.succes) {
                    Swal.close();
                    this.msj$ = this.mensajeResponse.succes(response.message).subscribe((action) => {
                        if (action) this.cerrarCarga();
                    });
                }
            },
            (error: any) => {
                Swal.close();
                this.msj$ = this.mensajeResponse.danger().subscribe((action) => {
                    if (action) this.cerrarCarga();
                });
            }
        );
    }

    onFileChange(event) {
        const file: FileList = event.target.files;

        if (!file[0]) return;

        if (!this.accepts.includes(file[0].name.toLocaleLowerCase().split('.').pop())) {
            this.error = { message: `Solo se aceptan archivos con formato ${this.accepts.join(', ')}.`, status: true };
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
