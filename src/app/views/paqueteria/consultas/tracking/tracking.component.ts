import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginacionModel, Seguimiento } from '@models/index';
import { FormControl } from '@angular/forms';
import { SeguimientoService } from '@services/modulos/operaciones/consultas/seguimiento/seguimiento.service';
import { RUTAS_PAQUETERIA_CONSULTAS } from '@routes/rutas-paqueteria';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
})
export class TrackingComponent implements OnInit {
    loading: boolean;
    selectItem: Seguimiento;
    data: Seguimiento[];
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    codigos: string[];
    codigo: FormControl;
    constructor(private router: Router, private seguimientoService: SeguimientoService) {
        this.loading = false;
        this.selectItem = new Seguimiento();
        this.data = [];
        this.pagina = 1;
        this.filas = 10;
        this.codigo = new FormControl('');
        this.codigos = [];
    }

    ngOnInit(): void {}

    consultar() {
        this.codigo.value.split(/\n/).forEach((item) => {
            if (item) {
                this.codigos.push(item);
            }
        });
        this.loading = true;
        this.seguimientoService.postConsultasCargo({ codigoBarra: this.codigos }).subscribe(
            (response) => {
                this.data = response.seguimientos;
                this.codigos = [];
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    detalle(codigo) {
        const route = RUTAS_PAQUETERIA_CONSULTAS;
        this.router.navigate([`${route.tracking.init}/${codigo}/${route.tracking.detalle}`]);
    }
}
