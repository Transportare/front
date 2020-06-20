import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { ClienteService } from '@services/modulos/gestion/mantenimientos/clientes/clientes.service';
declare var $: any;

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit, OnDestroy {
    @ViewChild('detalleCliente', { static: false }) detalleCliente: ElementRef;
    data: any[];
    selectItem: any;
    loading: boolean;
    pagina: number;
    filas: number;

    constructor(private clienteService: ClienteService, private router: Router) {
        this.selectItem = {};
    }

    ngOnInit() {
        this.loading = false;
        this.pagina = 1;
        this.filas = 10;
        this.data = [];
        this.listar();
    }

    listar(pagina: number = 1) {
        this.pagina = pagina;
        const params = {
            pagina: this.pagina,
            filas: this.filas,
        };

        this.loading = true;
        this.clienteService.getClientes(params).subscribe((response: any) => {
            console.log(response);
            this.data = response.data;
        });
        this.loading = false;
    }

    // obtenerCliente() {
    //     console.log(this.selectItem);
    // }

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    nuevoProveedor() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${route.clientes.nuevo}`]);
    }

    detalle() {
        // const route = RUTAS_GESTION_MANTENIMIENTOS;
        // this.router.navigate([`${route.clientes.init}/${this.selectItem.id}/${route.clientes.detalle}`]);
        $(this.detalleCliente.nativeElement).modal('show');
        // this.obtenerCliente();
    }

    cerrarModal() {
        $(this.detalleCliente.nativeElement).modal('hide');
    }

    editar() {
        const route = RUTAS_GESTION_MANTENIMIENTOS;
        this.router.navigate([`${route.clientes.init}/${this.selectItem.IdCliente}/${route.clientes.editar}`]);
    }
}
