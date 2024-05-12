import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'mantenimientos',
        loadChildren: () => import('./mantenimientos/mantenimientos.module').then((m) => m.MantenimientosModule),
        data: { roleId: [50] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'despachos',
        loadChildren: () => import('./despachos/despachos.module').then((m) => m.DespachosModule),
        data: { roleId: [55] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'consultas',
        loadChildren: () => import('./consultas/consultas.module').then((m) => m.ConsultasModule),
        data: { roleId: [60] },
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
