export class Cargo {
    destinatario: Destinatario;
    paquete: Paquete;
    remitente: Remitente;
    tracking: Tracking;
    constructor() {}
}

class Destinatario {
    apellidos: string;
    direccion: string;
    dni: string;
    idSucursal: number;
    idUbigeoDestino: string;
    localidad: string;
    nombres: string;
    palabraClave: string;
    referencia: string;
    sucursal: string;
    telefono: string;
    constructor() {}
}

class Paquete {
    cantidad: number;
    codigo: string;
    detalles: string;
    idTipoPaquete: number;
    pago: number;
    peso: string;
    precio: string;
    fecha: string;
    constructor() {}
}

class Remitente {
    apellidos: string;
    direccion: string;
    localidad: string;
    nombres: string;
    sucursal: string;
    dni: string;
    sucursalRemite: string;
    constructor() {}
}

class Tracking {
    codigoBarra: string;
    estadoCargo: string;
    fechaArriboDestino: string;
    fechaDescargo: string;
    fechaDespachoDestino: string;
    fechaSalida: string;
    fechaVisita: string;
    idCargo: number;
    idCliente: number;
    idEstadoCargo: number;
    idOrdenServicio: number;
    idServicio: number;

    constructor() {}
}
