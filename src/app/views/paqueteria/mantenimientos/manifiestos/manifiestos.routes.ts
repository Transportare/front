import { Routes } from '@angular/router';
import { ManifiestosComponent } from './manifiestos.component';

export const routes: Routes = [
    {
        path: '',
        component: ManifiestosComponent,
    },
    {
        path: ':id/detalle',
        loadChildren: () => import('./cargos/cargos.module').then((m) => m.CargosModule),
    },
    {
        path: ':id/:action',
        loadChildren: () => import('./cargos/cargos.module').then((m) => m.CargosModule),
    },
];
