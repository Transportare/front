import { Directive, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { FileItem } from '@models/index';

@Directive({
    selector: '[appDropFiles]',
})
export class DropFilesDirective implements OnInit {
    @Input() archivo: FileItem[];
    @Input() accept: string[];
    @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
    @Output() errorDrop: EventEmitter<{ message: string; status: boolean }> = new EventEmitter();
    constructor() {}

    ngOnInit(): void {}

    @HostListener('dragover', ['$event'])
    public onDragEnter(event: any) {
        this.prevenirDetener(event);
        this.mouseSobre.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any) {
        this.mouseSobre.emit(false);
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: any) {
        const transferencia = this.getTransferencia(event);
        if (!transferencia) {
            return;
        }

        this.extrarArchivos(transferencia.files);
        this.prevenirDetener(event);
        this.mouseSobre.emit(false);
    }

    private getTransferencia(event: any) {
        // compatibilidad de navegadores
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTrasnfer;
    }

    private extrarArchivos(archivos: FileList) {
        if (archivos.length > 1) {
            this.errorDrop.emit({ message: '*Solo se acepta un archivo', status: true });
            return;
        }

        this.errorDrop.emit({ message: '', status: false });

        if (this.validarTipo(archivos[0])) {
            this.archivo[0] = new FileItem(archivos[0]);
        }
    }

    // Validaciones
    private prevenirDetener(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    private validarTipo(archivo: File): boolean {
        if (archivo.type === '' || archivo.type === undefined) {
            return false;
        }

        if (this.accept.includes(archivo.name.toLocaleLowerCase().split('.').pop())) {
            this.errorDrop.emit({ message: 'Archivo cargado correctamente.', status: false });
            return true;
        } else {
            this.errorDrop.emit({ message: `Solo se aceptan archivos con formato ${this.accept.join(', ')}.`, status: true });
            return false;
        }
    }
}
