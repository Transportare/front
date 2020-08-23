import { Routes } from '@angular/router';
import { PerfilGuard } from '../../../guards/perfil.guard';

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
        path: 'salida-retorno-ruta',
        loadChildren: () => import('./salida-retorno/salida-retorno.module').then((m) => m.SalidaRetornoModule),
        data: { roleId: [52] },
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
