import { Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: PersonalComponent,
    },
    {
        path: route.personal.nuevo,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.personal.editar}`,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.personal.detalle}`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
