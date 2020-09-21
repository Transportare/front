import { comunes } from './comunes';
const item = `${comunes.init}despachos`;
export const RUTAS_PAQUETERIA_DESPACHOS = {
    init: `${item}`,
    ruta: {
        init: `${item}/ruta`,
        nuevo: 'nuevo',
        editar: 'editar',
        detalle: 'detalle',
    },
    salidaRuta: {
        init: `${item}/salida-ruta`,
        detalle: 'detalle',
        cargos: 'cargos',
    },
};
