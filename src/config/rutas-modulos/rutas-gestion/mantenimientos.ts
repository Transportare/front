import { comunes } from './comunes';
const item = `${comunes.init}mantenimientos`;
export const RUTAS_GESTION_MANTENIMIENTOS = {
    init: `${item}`,
    clientes: {
        init: `${item}/clientes`,
        nuevo: 'nuevo',
        editar: 'editar',
        detalle: 'detalle',
    },
    personal: {
        init: `${item}/personal`,
        nuevo: 'nuevo',
        editar: 'editar',
        detalle: 'detalle',
    },
    servicios: {
        init: `${item}/servicios`,
        detalle: 'detalle',
        editar: 'editar',
        nuevo: 'nuevo',
    },
};
