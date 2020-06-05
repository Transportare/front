import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./views/login/login.module').then((m) => m.LoginModule),
    },
    {
        canActivate: [AuthGuard],
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        path: 'gestion',
        loadChildren: () => import('./views/gestion/gestion.module').then((m) => m.GestionModule),
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
