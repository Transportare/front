import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { RUTAS_GESTION_MANTENIMIENTOS } from '@routes/rutas-gestion';
const route = RUTAS_GESTION_MANTENIMIENTOS;

export const routes: Routes = [
    {
        path: '',
        component: ClientesComponent,
    },
    {
        path: `${route.clientes.nuevo}`,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.clientes.editar}`,
        loadChildren: () => import('./formulario/formulario.module').then((m) => m.FormularioModule),
    },
    {
        path: `:id/${route.clientes.detalle}`,
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule],
// })
// export class ClientesRoutes {}
