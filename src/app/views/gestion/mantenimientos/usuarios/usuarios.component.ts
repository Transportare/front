import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { Usuario } from '@models/usuario';
import { UsuariosService } from '@services/modulos/gestion/mantenimientos/usuarios/usuarios.service';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
    selectItem: any;
    data: Usuario[];
    loading: boolean;

    constructor(private router: Router, private usuarioService: UsuariosService) {
        this.selectItem = {};
        this.loading = false;
    }

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.loading = true;
        this.usuarioService.getUsuarios().subscribe(
            (response) => {
                this.data = response;
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.usuarios.init}/${RUTAS_GESTION_MANTENIMIENTOS.usuarios.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.usuarios.init}/${this.selectItem.id}/${route.usuarios.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.usuarios.init}/${this.selectItem.id}/${route.usuarios.editar}`]);
    }
}
