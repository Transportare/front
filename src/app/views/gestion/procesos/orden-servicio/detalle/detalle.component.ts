import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PerfilService } from '@services/modulos/gestion/mantenimientos/perfiles/perfiles.service';
import { Usuario } from '@models/usuario';
import { TreeviewItem, TreeviewConfig, TreeviewEventParser, OrderDownlineTreeviewEventParser } from 'ngx-treeview';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
declare var $: any;

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }],
})
export class DetalleComponent implements OnInit, OnDestroy {
    data: TreeviewItem[];
    idPerfil: string;
    usuarios: Usuario[];
    items: any[];
    loading: boolean;
    msj$: Subscription;
    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400,
    });
    constructor(
        private router: Router,
        private perfilService: PerfilService,
        private activatedRoute: ActivatedRoute,
        private mensajeResponse: MensajeResponseService
    ) {
        this.usuarios = [];
        this.data = [];
        this.items = [];
        this.loading = false;
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.idPerfil = params.id;
                this.getUsuarios();
            } else {
                this.atras();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    getUsuarios() {
        this.loading = true;
        this.perfilService.getDataPorPerfil(this.idPerfil).subscribe(
            (response) => {
                this.usuarios = response.usuarios;
                this.data = response.privilegios;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    onSelectedChange(event) {
        this.items = event;
    }

    opcionesDatos(): number[] {
        const marcados = [];
        let padres = [];
        this.items.forEach((item, index) => {
            const value = item.item.value;
            if (item.parent) {
                const parent = item.parent;
                padres.push(parent.item.value);
                if (parent.parent) {
                    const parent2 = parent.parent.item.value;
                    padres.push(parent2);
                }
            }
            if (!marcados.includes(value)) {
                marcados.push(value);
            } else {
                marcados.splice(index, 1);
            }
        });
        padres = padres.filter((el, index) => padres.indexOf(el) === index);
        return [...padres, ...marcados];
    }

    guardarPrivilegios() {
        this.perfilService.getPrivilegiosPorPerfil(this.idPerfil, { opciones: this.opcionesDatos() }).subscribe(
            (response) => {
                this.msj$ = this.mensajeResponse.succes('Privilegios actualizados correctamente').subscribe((action) => {
                    if (action) {
                        this.getUsuarios();
                    }
                });
            },
            (error) => {
                this.msj$ = this.mensajeResponse.danger().subscribe();
            }
        );
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.perfiles.init}`]);
    }
}
