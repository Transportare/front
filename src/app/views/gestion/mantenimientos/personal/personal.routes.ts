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
        path: route.servicios.nuevo,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
];
