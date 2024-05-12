import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'salida-masivo',
        loadChildren: () => import('./salidas-masivo/salidas-masivo.module').then((m) => m.SalidasMasivoModule),
        data: { roleId: [31] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'descargo-masivo',
        loadChildren: () => import('./descargo-masivo/descargo-masivo.module').then((m) => m.DescargoMasivoModule),
        data: { roleId: [32] },
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
