import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'acordion-container',
    templateUrl: './accordion-container.template.html',
    styleUrls: ['./accordion-container.scss'],
})
export class AcordionContainerComponent implements OnInit {
    @Input() title: any;
    @Input() show: boolean;
    @Input() ocultarContenido: boolean;
    constructor() {
        this.title = '';
        this.show = false;
        this.ocultarContenido = true;
    }

    ngOnInit() {}

    showContainer() {
        if (this.ocultarContenido === true) {
            this.show = !this.show;
        }
    }
}
