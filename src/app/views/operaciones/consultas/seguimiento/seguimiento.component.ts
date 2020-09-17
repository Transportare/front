import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginacionModel, Seguimiento } from '@models/index';
import { FormControl } from '@angular/forms';
import { SeguimientoService } from '@services/modulos/operaciones/consultas/seguimiento/seguimiento.service';
import { RUTAS_OPERACIONES_CONSULTAS } from '@routes/rutas-operaciones';

@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.scss'],
})
export class ManifiestosComponent implements OnInit {
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

    detalle() {
        const route = RUTAS_OPERACIONES_CONSULTAS;
        this.router.navigate([`${route.seguimiento.init}/${this.selectItem.idOrdenServicio}/${route.seguimiento.detalle}`]);
    }
}
