import { comunes } from './comunes';
const item = `${comunes.init}consultas`;
export const RUTAS_PAQUETERIA_CONSULTAS = {
    init: `${item}`,
    tracking: {
        init: `${item}/e-tracking`,
        detalle: 'detalle',
    },
};
