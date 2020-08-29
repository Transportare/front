import { Routes } from '@angular/router';
import { ManifiestosComponent } from './manifiestos.component';

export const routes: Routes = [
    {
        path: '',
        component: ManifiestosComponent,
    },
    {
        path: 'nuevo',
        loadChildren: () => import('./salida-retorno/salida-retorno.module').then((m) => m.SalidaRetornoModule),
    },
    {
        path: `:id/detalle`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
