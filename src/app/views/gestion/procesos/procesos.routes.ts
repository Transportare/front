import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'orden-servicios',
        loadChildren: () => import('./orden-servicio/orden-servicio.module').then((m) => m.OrdenServicioModule),
        data: { roleId: [21] },
    },
    {
        path: 'carga-datos',
        loadChildren: () => import('./carga-datos/carga-datos.module').then((m) => m.CargaDatosModule),
        data: { roleId: [22] },
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
