import { Routes } from '@angular/router';

export const routes: Routes = [
    // {
    //     path: 'dashboard',
    // loadChildren: () =>
    //     import('../../dashboard/dashboard.module').then(
    //         (m) => m.DashboardModule
    //     ),
    // },
    {
        path: 'clientes',
        loadChildren: () =>
            import('./clientes/clientes.module').then((m) => m.ClientesModule),
    },
    {
        path: 'contactos',
        loadChildren: () =>
            import('./contactos/contactos.module').then(
                (m) => m.ContactosModule
            ),
    },
    {
        path: 'servicios',
        loadChildren: () =>
            import('./servicios/servicios.module').then(
                (m) => m.ServiciosModule
            ),
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
