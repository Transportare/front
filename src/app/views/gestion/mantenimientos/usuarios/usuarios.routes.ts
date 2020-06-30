import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: UsuariosComponent,
    },
];
