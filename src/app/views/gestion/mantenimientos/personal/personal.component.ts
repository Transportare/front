import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
})
export class PersonalComponent implements OnInit {
    selectItem: any;
    data: any[];

    constructor(private router: Router) {
        this.selectItem = {};
    }

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.data = [
            {
                id: 1,
                ubigeo: 'Surco',
                codigo: '224as1d2',
                nombres: 'Miguel Angel',
                apellidos: 'Morales Larriega',
                dni: '72491744',
                fecha_nacimiento: '20/05/98',
                direccion: 'Calle Las Cerezas 235 - Surco',
                genero: 'Masculino',
                estado_civil: 'Soltero',
                telefono: '895724554',
                fecha_ingreso: '20/05/98',
                tipo: 'Destajo',
                estado: true,
            },
            {
                id: 2,
                ubigeo: 'Surco',
                codigo: '224as1d2',
                nombres: 'Miguel Angel',
                apellidos: 'Morales Larriega',
                dni: '72491744',
                fecha_nacimiento: '20/05/98',
                direccion: 'Calle Las Cerezas 235 - Surco',
                genero: 'Masculino',
                estado_civil: 'Soltero',
                telefono: '895724554',
                fecha_ingreso: '20/05/98',
                tipo: 'Destajo',
                estado: true,
            },
            {
                id: 3,
                ubigeo: 'Surco',
                codigo: '224as1d2',
                nombres: 'Miguel Angel',
                apellidos: 'Morales Larriega',
                dni: '72491744',
                fecha_nacimiento: '20/05/98',
                direccion: 'Calle Las Cerezas 235 - Surco',
                genero: 'Masculino',
                estado_civil: 'Soltero',
                telefono: '895724554',
                fecha_ingreso: '20/05/98',
                tipo: 'Destajo',
                estado: true,
            },
            {
                id: 4,
                ubigeo: 'Surco',
                codigo: '224as1d2',
                nombres: 'Miguel Angel',
                apellidos: 'Morales Larriega',
                dni: '72491744',
                fecha_nacimiento: '20/05/98',
                direccion: 'Calle Las Cerezas 235 - Surco',
                genero: 'Masculino',
                estado_civil: 'Soltero',
                telefono: '895724554',
                fecha_ingreso: '20/05/98',
                tipo: 'Destajo',
                estado: true,
            },
            {
                id: 5,
                ubigeo: 'Surco',
                codigo: '224as1d2',
                nombres: 'Miguel Angel',
                apellidos: 'Morales Larriega',
                dni: '72491744',
                fecha_nacimiento: '20/05/98',
                direccion: 'Calle Las Cerezas 235 - Surco',
                genero: 'Masculino',
                estado_civil: 'Soltero',
                telefono: '895724554',
                fecha_ingreso: '20/05/98',
                tipo: 'Destajo',
                estado: true,
            },
        ];
    }

    nuevo() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.personal.init}/${RUTAS_GESTION_MANTENIMIENTOS.personal.nuevo}`]);
    }

    detalle() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.id}/${route.personal.detalle}`]);
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.personal.init}/${this.selectItem.id}/${route.personal.editar}`]);
    }
}
