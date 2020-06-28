import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { PerfilService } from '@services/modulos/gestion/mantenimientos/perfiles/perfiles.service';
import { Usuario } from '@models/usuario';
declare var $: any;

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
})
export class DetalleComponent implements OnInit, OnDestroy {
    data: any[];
    idPerfil: string;
    usuarios: Usuario[];
    constructor(private router: Router, private perfilService: PerfilService, private activatedRoute: ActivatedRoute) {
        this.usuarios = [];
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
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    getUsuarios() {
        this.perfilService.getUsuariosPorPerfil(this.idPerfil).subscribe((response) => {
            console.log(response);
            this.usuarios = response.usuarios;
        });
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.perfiles.init}`]);
    }
}
