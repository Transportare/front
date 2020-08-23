import { comunes } from './comunes';
const item = `${comunes.init}paqueteria`;
export const RUTAS_OPERACIONES_TRACKING = {
    init: `${item}`,
    ruta: {
        init: `${item}/ruta`,
        nuevo: 'nuevo',
        editar: 'editar',
        detalle: 'detalle',
    },
    salidaRetorno: {
        init: `${item}/salida-retorno-ruta`,
    },
};
