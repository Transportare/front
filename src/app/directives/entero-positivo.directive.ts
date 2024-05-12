import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[EnteroPositivo]',
})
export class EnteroPositivoDirective {
    @Output() valueEntero: EventEmitter<any> = new EventEmitter<any>();
    public teclasNumero = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    public teclasUtil = [9, 35, 36, 37, 38, 39, 40, 8, 13];
    public validar = [];
    @Input() maxNumerolength: number;
    @Input() separador: boolean;
    constructor(private el: ElementRef) {
        this.maxNumerolength = 20;
        this.validar = this.teclasNumero.concat(this.teclasUtil);
        this.separador = false;
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        const e = <KeyboardEvent>event;
        let length = this.el.nativeElement.value.replace(/,/gi, '');
        length = length.length;
        if (e.shiftKey) {
            e.preventDefault();
        }
        if (this.teclasNumero.indexOf(e.keyCode) !== -1 && length >= Number(this.maxNumerolength)) {
            e.preventDefault();
        }

        if (
            this.validar.indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) || // seleccionar
            (e.keyCode === 67 && e.ctrlKey === true) || // copiar
            (e.keyCode === 86 && e.ctrlKey === true) || // pegar
            (e.keyCode === 88 && e.ctrlKey === true) || // cortar
            (e.keyCode === 89 && e.ctrlKey === true) || // control + Y
            (e.keyCode === 90 && e.ctrlKey === true) // control + Z
        ) {
            return;
        }
        e.preventDefault();
    }

    @HostListener('keyup', ['$event']) onkeyUp(event) {
        const value = this.el.nativeElement.value.replace(/,/gi, '');
        let numero = this.validarNumeros(value.trim());
        if (numero.length > Number(this.maxNumerolength)) {
            numero = numero.substring(0, this.maxNumerolength);
        }
        if (this.separador) {
            numero = this.salidaSeparadores(numero);
        }
        this.valueEntero.emit(numero);
    }

    @HostListener('change', ['$event']) onchange(event) {
        const value = this.el.nativeElement.value.replace(/,/gi, '');
        let numero = this.validarNumeros(value.trim());
        numero = numero.substring(0, this.maxNumerolength);
        if (this.separador) {
            numero = this.salidaSeparadores(numero);
        }
        this.valueEntero.emit(numero);
    }

    validarNumeros(palabra) {
        const cadena = '0123456789';
        let numero = '';
        for (let i = 0; i < palabra.length; i++) {
            const ch = palabra.charAt(i);
            for (let j = 0; j < cadena.length; j++) {
                if (ch === cadena.charAt(j)) {
                    numero = numero + ch;
                }
            }
        }
        return numero;
    }

    salidaSeparadores(value) {
        const salida = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return salida;
    }
}
