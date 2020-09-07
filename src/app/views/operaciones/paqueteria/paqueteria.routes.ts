import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'ruta',
        loadChildren: () => import('./ruta/ruta.module').then((m) => m.RutaModule),
        data: { roleId: [51] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then((m) => m.ClientesModule),
        data: { roleId: [53] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'manifiestos',
        loadChildren: () => import('./manifiestos/manifiestos.module').then((m) => m.ManifiestosModule),
        data: { roleId: [54] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'descargo-masivo',
        loadChildren: () => import('./descargo-masivo/descargo-masivo.module').then((m) => m.DescargoMasivoModule),
        data: { roleId: [56] },
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
