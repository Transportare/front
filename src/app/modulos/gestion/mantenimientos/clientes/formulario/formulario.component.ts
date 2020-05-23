import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit {
    data: any[];

    constructor() {}

    ngOnInit() {
        this.data = [
            {
                id: 0,
                text: 'Numero 1',
            },
            {
                id: 1,
                text: 'Carlos',
            },
            {
                id: 2,
                text: 'Mirella',
            },
            {
                id: 3,
                text: 'Josie',
            },
        ];
    }

    selectChange(event) {
        console.log(event);
    }
}
