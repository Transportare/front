import { Routes } from '@angular/router';
import { RutaComponent } from './ruta.component';

export const routes: Routes = [
    {
        path: '',
        component: RutaComponent,
    },
    {
        path: 'nuevo',
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
];
