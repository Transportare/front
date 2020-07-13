import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'orden-servicios',
        loadChildren: () => import('./orden-servicio/orden-servicio.module').then((m) => m.OrdenServicioModule),
        data: { roleId: [21] },
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
