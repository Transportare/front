import { Routes } from '@angular/router';
import { PerfilGuard } from '../../guards/perfil.guard';

export const routes: Routes = [
    // {
    //     canActivate: [PerfilGuard],
    //     canActivateChild: [PerfilGuard],
    //     path: 'mantenimientos',
    //     loadChildren: () => import('./mantenimientos/mantenimientos.module').then((m) => m.MantenimientosModule),
    //     data: { roleId: [10] },
    // },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'tracking',
        loadChildren: () => import('./tracking/tracking.module').then((m) => m.TrackingModule),
        data: { roleId: [20] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'despachos',
        loadChildren: () => import('./despachos/despachos.module').then((m) => m.DespachosModule),
        data: { roleId: [20] },
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
