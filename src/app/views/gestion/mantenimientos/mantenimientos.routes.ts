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
        loadChildren: () => import('./clientes/clientes.module').then((m) => m.ClientesModule),
    },
    {
        path: 'personal',
        loadChildren: () => import('./personal/personal.module').then((m) => m.PersonalModule),
    },
    {
        path: 'servicios',
        loadChildren: () => import('./servicios/servicios.module').then((m) => m.ServiciosModule),
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
    },
    {
        path: 'perfiles',
        loadChildren: () => import('./perfiles/perfiles.module').then((m) => m.PerfilesModule),
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
