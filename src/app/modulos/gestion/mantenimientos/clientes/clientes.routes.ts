import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ClientesComponent } from './clientes.component';

const routes: Routes = [
    {
        path: '',
        component: ClientesComponent,
    },
    {
        path: ':id/nuevo',
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientesRoutes {}
