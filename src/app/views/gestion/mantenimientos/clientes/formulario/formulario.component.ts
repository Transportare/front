import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaGeneralService } from '@services/utils/tablageneral.service';
declare var $: any;

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit, OnDestroy {
    formularioCliente: FormGroup;
    tipoPagos: any[];
    selectedPago: any;

    constructor(private router: Router, private fb: FormBuilder, private tablaGeneralService: TablaGeneralService) {}

    ngOnInit() {
        this.initData();
        this.listarSelects();
        this.initForm();
    }

    ngOnDestroy(): void {
        // if (this.msj$) {
        //     this.msj$.unsubscribe();
        // }
    }

    initData() {
        this.tipoPagos = [];
        this.selectedPago = { id: '', text: 'Seleccione Tipo' };
    }

    initForm() {
        this.formularioCliente = this.fb.group({
            nombre: ['', Validators.required],
            ruc: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', Validators.required],
            correo: ['', Validators.required],
            contacto: ['', Validators.required],
            ubigeo: ['', Validators.required],
            rubro: ['', Validators.required],
            idTipopago: ['', Validators.required],
            observacion: ['', Validators.required],
        });
    }

    listarSelects() {
        // Tipo de Pago
        this.tablaGeneralService.getSelectPorGrupo(6).subscribe((response: any) => {
            console.log(response);
            this.tipoPagos = response;
        });
    }

    changeTipoPago(event) {
        console.log(event);
        this.formularioCliente.patchValue({
            idTipopago: event.id,
        });
    }

    crearCliente() {
        console.log(this.formularioCliente.value);
    }

    atras() {
        this.router.navigate([`${RUTAS_GESTION_MANTENIMIENTOS.clientes.init}`]);
    }
}
