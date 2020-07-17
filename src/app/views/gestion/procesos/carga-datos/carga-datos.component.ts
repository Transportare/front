import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
import { FileItem } from '@models/index';
import { CargaDatosService } from '@services/modulos/gestion/procesos/carga-datos/carga-datos.service';
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
    @ViewChild('modalCarga', { static: false }) modalCarga: ElementRef;

    constructor(private router: Router, private mensajeResponse: MensajeResponseService, private cargarDatosService: CargaDatosService) {
        this.loading = false;
        this.estaSobre = false;
        this.archivo = [];
        this.error = { status: false, message: '' };
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
    }

    guardarCarga() {
        console.log(this.archivo[0]);

        this.cargarDatosService.postCargarDatos(this.archivo[0].archivo).subscribe(
            (response) => {
                console.log(response);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    onFileChange(event) {
        const file: FileList = event.target.files;

        if (file[0].name.toLocaleLowerCase().split('.').pop() !== 'xlsx' && file[0].name.toLocaleLowerCase().split('.').pop() !== 'xls') {
            this.error = { message: 'Solo se aceptan archivos con formato excel.', status: true };
            return;
        } else {
            this.error = { message: 'Archivo cargado correctamente.', status: false };
            this.archivo = [new FileItem(file[0])];
        }
    }

    validacionArchivos(event) {
        this.error = event;
    }
}
