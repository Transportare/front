import { Routes } from '@angular/router';
import { PerfilesComponent } from './perfiles.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: PerfilesComponent,
    },
    {
        path: `:id/${route.perfiles.detalle}`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
