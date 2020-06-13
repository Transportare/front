import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MensajeResponseService {
    constructor() {}

    succes(msj: string): Observable<any> {
        return new Observable((observer) => {
            this.mensajeResponse(msj, '¡Genial!', 'success', observer);
        });
    }

    danger(msj: string = 'Ocurrio un problema, intente nuevamente por favor.'): Observable<any> {
        return new Observable((observer) => {
            this.mensajeResponse(msj, '¡Oops!', 'error', observer);
        });
    }

    mensajeResponse(texto: string, titulo: string, action: SweetAlertIcon, observer: Subscriber<boolean>) {
        Swal.fire({
            icon: action,
            title: titulo,
            text: texto,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            allowEscapeKey: false,
            allowOutsideClick: false,
        }).then((result: any) => {
            observer.next(result.value);
            observer.complete();
        });
    }
}
