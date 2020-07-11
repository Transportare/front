import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilGuard } from '../guards/perfil.guard';

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
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
