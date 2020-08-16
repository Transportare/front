import { Routes } from '@angular/router';
import { PerfilGuard } from '../../../guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'salida-masivo',
        loadChildren: () => import('./salidas-masivo/salidas-masivo.module').then((m) => m.SalidasMasivoModule),
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
