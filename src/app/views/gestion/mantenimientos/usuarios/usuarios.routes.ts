import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';

const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: UsuariosComponent,
    },
    {
        path: route.usuarios.nuevo,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.usuarios.editar}`,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.usuarios.detalle}`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
