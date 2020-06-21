import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginacionModel } from '../../../models/paginacion.model';

@Component({
    selector: 'app-paginacion',
    templateUrl: './paginacion.component.html',
    styleUrls: ['./paginacion.component.scss'],
})
export class PaginacionComponent implements OnInit {
    @Input() data: PaginacionModel;
    @Output() changePage: EventEmitter<number> = new EventEmitter();
    constructor() {
        this.data = new PaginacionModel(0, 0, 0, 0, 0, 0, 0, 0);
    }

    next() {
        if (this.data.pag_siguiente !== null) {
            this.changePage.emit(this.data.pag_siguiente);
        }
    }

    previus() {
        if (this.data.pag_anterior !== null) {
            this.changePage.emit(this.data.pag_anterior);
        }
    }

    ngOnInit(): void {}
}
