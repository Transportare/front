import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then((m) => m.ClientesModule),
        data: { roleId: [11] },
    },
    {
        path: 'personal',
        loadChildren: () => import('./personal/personal.module').then((m) => m.PersonalModule),
        data: { roleId: [12] },
    },
    {
        path: 'servicios',
        loadChildren: () => import('./servicios/servicios.module').then((m) => m.ServiciosModule),
        data: { roleId: [13] },
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
        data: { roleId: [14] },
    },
    {
        path: 'perfiles',
        loadChildren: () => import('./perfiles/perfiles.module').then((m) => m.PerfilesModule),
        data: { roleId: [15] },
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
