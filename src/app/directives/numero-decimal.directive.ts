import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[NumeroDecimal]',
})
export class NumeroDecimalDirective {
    @Output() valueEntero: EventEmitter<any> = new EventEmitter<any>();
    public teclasNnumero = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    public puntoDecimal = [110, 190];
    public teclasUutil = [9, 35, 36, 37, 38, 39, 40, 8];
    public validar = [];
    public valueDown: number;
    @Input() minNumber: number;
    @Input() maxNumber: number;
    @Input() NumeroDecimal: boolean;
    @Input() numeroDecimales: number;
    @Input() separador: boolean;

    constructor(private el: ElementRef) {
        this.maxNumber = 999999999;
        this.minNumber = 0;
        this.separador = false;
        this.validar = this.teclasNnumero.concat(this.teclasUutil);
        this.validar = this.validar.concat(this.puntoDecimal);
        this.numeroDecimales = 2;
    }
    @HostListener('keydown', ['$event']) onKeyDown(event) {
        const e = <KeyboardEvent>event;
        // const e = event;
        this.valueDown = Number(this.el.nativeElement.value);
        const length = Number(this.el.nativeElement.value.length);
        if (e.shiftKey) {
            e.preventDefault();
        }
        // validar solo un punto decimal
        if (
            (this.puntoDecimal.indexOf(e.keyCode) > -1 && this.el.nativeElement.value.indexOf(e.key) > -1) ||
            (this.puntoDecimal.indexOf(e.keyCode) > -1 && length === 0)
        ) {
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
        let numero: any = this.validarNumeros(value.trim());
        let emit = false;
        if (Number(numero) > Number(this.maxNumber) && !emit) {
            let maxNumber = this.maxNumber.toString();
            if (this.separador) {
                maxNumber = this.salidaSeparadores(maxNumber);
            }
            emit = true;
            this.valueEntero.emit(maxNumber);
        }
        const decimales = numero.split('.');
        if (decimales[1] !== undefined && !emit) {
            let numeroFinal = decimales[0] + '.' + decimales[1].substring(0, this.numeroDecimales);
            if (this.separador) {
                numeroFinal = this.salidaSeparadores(numeroFinal);
            }
            emit = true;

            this.valueEntero.emit(numeroFinal);
        }
        if (this.separador && !emit) {
            if (numero === '') {
                numero = '';
            } else {
                numero = Number(numero);
            }
            emit = true;
            this.valueEntero.emit(this.salidaSeparadores(numero));
        }
    }
    @HostListener('change', ['$event']) onchange(event) {
        const value = this.el.nativeElement.value.replace(/,/gi, '');
        const numero: any = this.validarNumeros(value.trim());
        const decimales = numero.split('.');
        if (decimales[1] !== undefined) {
            const numDecimales = decimales[1].length;
            if (numDecimales >= this.numeroDecimales) {
            } else {
                const totalDecimales = this.numeroDecimales - numDecimales;
                for (let index = 0; index < totalDecimales; index++) {
                    decimales[1] += '0';
                }
                this.valueEntero.emit(this.salidaSeparadores(decimales[0] + '.' + decimales[1]));
            }
        } else {
            let _decimales = '';
            for (let index = 0; index < this.numeroDecimales; index++) {
                _decimales += '0';
            }
            this.valueEntero.emit(this.salidaSeparadores(decimales[0] + '.' + _decimales));
        }
    }
    validarNumeros(palabra) {
        const cadena = '0123456789.';
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
        const entrada = value.toString().split('.');
        const parteEntera = entrada[0].replace(/\./g, '');
        const parteDecimal = entrada[1];
        const salida = parteEntera.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (parteEntera === '') {
            return '';
        } else {
            return salida + (parteDecimal !== undefined ? '.' + parteDecimal.substring(0, this.numeroDecimales) : '');
        }
    }
}
