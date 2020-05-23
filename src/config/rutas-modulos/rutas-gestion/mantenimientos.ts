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
    // contactos: {
    //     init: `${item}/otrosconceptos`,
    //     nuevo: 'nuevo',
    //     editar: 'editar',
    //     detalle: 'detalle'
    // },
    // servicios: {
    //     init: `${item}/proveedores`,
    //     detalle: 'detalle',
    //     editar: 'editar',
    //     nuevo: 'nuevo'
    // }
};
