import { comunes } from './comunes';
const item = `${comunes.init}consultas`;
export const RUTAS_OPERACIONES_CONSULTAS = {
    init: `${item}`,
    seguimiento: {
        init: `${item}/ruta`,
        detalle: 'detalle',
    },
};
