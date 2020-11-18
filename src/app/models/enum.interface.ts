export enum Genero {
    MASCULINO = 11,
    FEMENINO = 12,
}

export enum EstadoCivil {
    SOLTERO = 21,
    CASADO = 22,
    VIUDO = 23,
    DIVORCIADO = 24,
    CONVIVIENTE = 25,
}

export enum CargoPersonal {
    CHOFER = 31,
    MENSAJERO = 32,
    AUXILIAR = 33,
    MOTORIZADO = 34,
    ADMINISTRATIVO = 35,
    GERENCIA = 36,
}

export enum Area {
    SISTEMAS = 41,
    OPERACIONES = 42,
    DISTRIBUCION = 43,
    GERENCIA = 44,
    ADMINISTRACION = 45,
    CONTABILIDAD = 46,
}

// export enum Sucursal {
//     P = 51,
// }

export enum TipoPago {
    CHEQUE = 61,
    EFECTIVO = 62,
    TRANSFERENCIA = 63,
    DEPOSITO = 64,
    SALDOS = 65,
}

export enum TipoServicio {
    MENSAJERIA = 71,
    PAQUETERIA = 72,
    VALORADOS = 73,
}

export enum TipoCliente {
    PERSONA_JURIDICA = 81,
    PERSONA_NATURAL = 82,
}

export enum EstadoMensajeria {
    PENDIENTE = 91,
    EN_REPARTO = 92,
    ENTREGADO = 93,
    MOTIVO = 94,
}

export enum EstadoTracking {
    RECOLECTADO = 110,
    DESPACHO_DESTINO = 111,
    ARRIBO_DESTINO = 112,
    EN_RUTA_DOMICILIO = 113,
    ENTREGA_VISITA = 114,
}

export enum TipoPaquete {
    FRAGIL = 121,
    NORMAL = 122,
}

export enum EstadoGuia {
    PENDIENTE = 152,
    CERRADA = 153,
}

export enum DetalleEntrega {
    ENTREGADO_TITULAR = 161,
    ENTREGADO_FAMILIAR = 162,
    ENTREGADO_TERCERO = 163,
    ENTREGADO_VIGILANTE = 164,
    BAJO_PUERTA = 165,
    BUZON = 166,
    SELLO = 167,
}

export enum DetalleMotivo {
    AUSENTE = 171,
    RECHAZADO = 172,
    DESCONOCIDO = 173,
    SE_MUDO = 174,
    DIRECCION_NO_EXISTE = 175,
    DIRECCION_INCOMPLETA = 176,
}

export enum TipoTemporal {
    SALIDA_DESTINO_PAQUETERIA_TEMPORAL = 191,
    DESCARGO_RUTA_PAQUETERIA_TEMPORAL = 192,
    SALIDA_RUTA_PAQUETERIA_TEMPORAL = 193,
}
