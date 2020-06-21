export class PaginacionModel {
    // tslint:disable: variable-name
    item_desde: number;
    item_hasta: number;
    item_pagina: number;
    item_total: number;
    pag_actual: number;
    pag_anterior: number;
    pag_siguiente: number;
    pag_total: number;
    constructor(
        item_desde: number,
        item_hasta: number,
        item_pagina: number,
        item_total: number,
        pag_actual: number,
        pag_anterior: number,
        pag_siguiente: number,
        pag_total: number
    ) {
        this.item_desde = item_desde;
        this.item_hasta = item_hasta;
        this.item_pagina = item_pagina;
        this.item_total = item_total;
        this.pag_actual = pag_actual;
        this.pag_anterior = pag_anterior;
        this.pag_siguiente = pag_siguiente;
        this.pag_total = pag_total;
    }
}
