import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ViewComponent } from './views/views.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./views/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: '',
        component: ViewComponent,
        loadChildren: () => import('./views/views.module').then((m) => m.ViewModule),
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
