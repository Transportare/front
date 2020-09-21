import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';

export const routes: Routes = [
    {
        path: '',
        component: ClientesComponent,
    },
    {
        path: ':id/detalle',
        loadChildren:() => import('./detalle/detalle.module').then(m => m.DetalleModule)
    },
];
