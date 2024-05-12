import { comunes } from './comunes';
const item = `${comunes.init}mantenimientos`;
export const RUTAS_PAQUETERIA_MANTENIMIENTOS = {
    init: `${item}`,
    clientes: {
        init: `${item}/clientes`,
        detalle: 'detalle',
    },
    manifiestos: {
        init: `${item}/manifiestos`,
        nuevo: 'nuevo',
        detalle: 'detalle',
        cargos: 'cargos',
    },
};
