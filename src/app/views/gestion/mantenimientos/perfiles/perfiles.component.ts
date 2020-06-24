import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PerfilService } from '@services/modulos/gestion/mantenimientos/perfiles/perfiles.service';
import { Perfil } from '@models/perfil';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
declare var $: any;

@Component({
    selector: 'app-perfiles',
    templateUrl: './perfiles.component.html',
    styleUrls: ['./perfiles.component.scss'],
})
export class PerfilesComponent implements OnInit, OnDestroy {
    selectItem: Perfil;
    perfiles: Perfil[];
    loading: boolean;
    msj$: Subscription;
    nombrePerfil: FormControl;
    estados: any[];
    estadoSelected: any;
    @ViewChild('modalPerfil', { static: false }) modalPerfil: ElementRef;

    constructor(private router: Router, private perfilService: PerfilService, private mensajeResponse: MensajeResponseService) {
        this.selectItem = new Perfil();
        this.perfiles = [];
        this.estados = [
            { id: 1, text: 'Activo' },
            { id: 0, text: 'Inactivo' },
        ];
        this.estadoSelected = {};
        this.loading = false;
        this.nombrePerfil = new FormControl('', Validators.required);
    }

    ngOnInit(): void {
        this.listar();
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    listar() {
        this.loading = true;
        this.perfilService.getPerfiles().subscribe(
            (response) => {
                this.perfiles = response;
                console.log(response);
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    nuevo() {
        $(this.modalPerfil.nativeElement).modal('show');
    }

    cerrarModal() {
        $(this.modalPerfil.nativeElement).modal('hide');
        this.nombrePerfil.reset();
        this.selectItem = new Perfil();
    }

    editar() {
        this.nombrePerfil.setValue(this.selectItem.nombrePerfil);
        this.estadoSelected = this.estados.find((e) => e.id === this.selectItem.estado);
        this.nuevo();
    }

    changeEstado(event) {
        this.estadoSelected = event;
    }

    generarPerfil() {
        const perfil: Perfil = new Perfil();
        // console.log({ ...perfil, nombrePerfil: this.nombrePerfil.value });
        if (!this.selectItem.idPerfil) {
            // Nuevo
            this.perfilService.postPerfil({ ...perfil, nombrePerfil: this.nombrePerfil.value }).subscribe(
                (response) => {
                    this.cerrarModal();
                    this.msj$ = this.mensajeResponse.succes('Perfil creado correctamente').subscribe((action) => {
                        if (action) {
                            this.listar();
                            this.selectItem = new Perfil();
                        }
                    });
                },
                (error) => {
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        } else {
            // Editar
            console.log({ ...perfil, nombrePerfil: this.nombrePerfil.value, estado: this.estadoSelected.id });
        }
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.perfiles.init}/${this.selectItem.idPerfil}/${route.perfiles.detalle}`]);
    }
}
