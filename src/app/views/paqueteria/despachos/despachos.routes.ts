import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'ruta',
        loadChildren: () => import('./ruta/ruta.module').then((m) => m.RutaModule),
        data: { roleId: [56] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'salida-ruta',
        loadChildren: () => import('./salida-ruta/salida-ruta.module').then((m) => m.SalidaRutaModule),
        data: { roleId: [57] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'descargo-masivo',
        loadChildren: () => import('./descargo-masivo/descargo-masivo.module').then((m) => m.DescargoMasivoModule),
        data: { roleId: [58] },
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
