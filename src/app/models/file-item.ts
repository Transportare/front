export class FileItem {
    public archivo: File;
    public name: string;
    constructor(archivo: File) {
        this.archivo = archivo;
        this.name = archivo.name;
    }
}
