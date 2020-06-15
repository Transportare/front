import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        canActivate: [AuthGuard],
        path: 'gestion',
        loadChildren: () => import('./gestion/gestion.module').then((m) => m.GestionModule),
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
