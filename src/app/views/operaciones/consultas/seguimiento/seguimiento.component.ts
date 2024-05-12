import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginacionModel } from '@models/index';
import { FormControl } from '@angular/forms';
import { SeguimientoService } from '@services/modulos/operaciones/consultas/seguimiento/seguimiento.service';
import { RUTAS_OPERACIONES_CONSULTAS } from '@routes/rutas-operaciones';
import { TipoServicio } from '@models/enum.interface';

@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.scss'],
})
export class ManifiestosComponent implements OnInit {
    loading: boolean;
    selectItem: any;
    data: any[];
    pagina: number;
    filas: number;
    dataPaginacion: PaginacionModel;
    codigos: string[];
    codigo: FormControl;
    constructor(private router: Router, private seguimientoService: SeguimientoService) {
        this.loading = false;
        this.selectItem = {};
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
        this.seguimientoService
            .postConsultasCargoMensajeria({ codigoBarra: this.codigos, tipoServicio: TipoServicio.MENSAJERIA })
            .subscribe(
                (response) => {
                    this.data = response;
                    this.codigos = [];
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                }
            );
    }
}
