import { comunes } from './comunes';
const item = `${comunes.init}paqueteria`;
export const RUTAS_OPERACIONES_PAQUETERIA = {
    init: `${item}`,
    ruta: {
        init: `${item}/ruta`,
        nuevo: 'nuevo',
        editar: 'editar',
        detalle: 'detalle',
    },
    manifiestos: {
        init: `${item}/manifiestos`,
        nuevo: 'nuevo',
        detalle: 'detalle',
        cargos: 'cargos',
    },
};
