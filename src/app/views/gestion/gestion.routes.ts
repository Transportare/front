import { Routes } from '@angular/router';
import { PerfilGuard } from '../../guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'mantenimientos',
        loadChildren: () => import('./mantenimientos/mantenimientos.module').then((m) => m.MantenimientosModule),
        data: { roleId: [10] },
    },
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'procesos',
        loadChildren: () => import('./procesos/procesos.module').then((m) => m.ProcesosModule),
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
