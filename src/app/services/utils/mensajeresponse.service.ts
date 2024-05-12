import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MensajeResponseService {
    constructor() {}

    succes(msj: string, cancelButton: boolean = false): Observable<any> {
        return new Observable((observer) => {
            this.mensajeResponse(msj, '¡Genial!', 'success', cancelButton, observer);
        });
    }

    danger(msj: string = 'Ocurrio un problema, intente nuevamente por favor.', cancelButton: boolean = false): Observable<any> {
        return new Observable((observer) => {
            this.mensajeResponse(msj, '¡Oops!', 'error', cancelButton, observer);
        });
    }

    action(msj: string, cancelButton: boolean = false): Observable<any> {
        return new Observable((observer) => {
            this.mensajeResponse(msj, '¿Estas Seguro?', 'warning', cancelButton, observer);
        });
    }

    private mensajeResponse(texto: string, titulo: string, action: SweetAlertIcon, cancelButton, observer: Subscriber<boolean>) {
        Swal.fire({
            icon: action,
            title: titulo,
            text: texto,
            showCancelButton: cancelButton,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
        }).then((result: any) => {
            observer.next(result.value);
            observer.complete();
        });
    }
}
