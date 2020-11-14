import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then((m) => m.ClientesModule),
        data: { roleId: [51] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'manifiestos',
        loadChildren: () => import('./manifiestos/manifiestos.module').then((m) => m.ManifiestosModule),
        data: { roleId: [52] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'carga-datos',
        loadChildren: () => import('./carga-datos/carga-datos.module').then((m) => m.CargaDatosModule),
        data: { roleId: [53] },
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
