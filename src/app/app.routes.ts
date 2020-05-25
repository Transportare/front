import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
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
