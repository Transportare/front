import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'despachos',
        loadChildren: () => import('./despachos/despachos.module').then((m) => m.DespachosModule),
        data: { roleId: [30] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'consultas',
        loadChildren: () => import('./consultas/consultas.module').then((m) => m.ConsultasModule),
        data: { roleId: [40] },
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
