import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        canActivate: [AuthGuard, PerfilGuard],
        path: 'gestion',
        loadChildren: () => import('./gestion/gestion.module').then((m) => m.GestionModule),
        data: { roleId: [1] },
    },
    {
        canActivate: [AuthGuard, PerfilGuard],
        path: 'operaciones',
        loadChildren: () => import('./operaciones/operaciones.module').then((m) => m.OperacionesModule),
        data: { roleId: [2] },
    },
    {
        canActivate: [AuthGuard, PerfilGuard],
        path: 'paqueteria',
        loadChildren: () => import('./paqueteria/paqueteria.module').then((m) => m.PaqueteriaModule),
        data: { roleId: [3] },
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
