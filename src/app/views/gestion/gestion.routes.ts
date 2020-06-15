import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'mantenimientos',
        loadChildren: () => import('./mantenimientos/mantenimientos.module').then((m) => m.MantenimientosModule),
    },
    {
        path: '',
        redirectTo: '/dashboard',
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
