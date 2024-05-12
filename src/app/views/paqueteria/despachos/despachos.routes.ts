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
        path: 'despacho-destino',
        loadChildren: () => import('./despacho-destino/despacho-destino.module').then((m) => m.DespachoDestinoModule),
        data: { roleId: [56] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'salida-ruta',
        loadChildren: () => import('./salida-ruta/salida-ruta.module').then((m) => m.SalidaRutaModule),
        data: { roleId: [58] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'descargo-ruta',
        loadChildren: () => import('./descargo-ruta/descargo-ruta.module').then((m) => m.DescargoRutaModule),
        data: { roleId: [59] },
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
