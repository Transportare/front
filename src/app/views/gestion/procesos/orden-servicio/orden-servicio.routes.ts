import { Routes } from '@angular/router';
import { OrdenServicioComponent } from './orden-servicio.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: OrdenServicioComponent,
    },
    {
        path: `:id/${route.perfiles.detalle}`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
