import { Routes } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'mantenimientos',
                loadChildren: () =>
                    import('./mantenimientos/mantenimientos.module').then(
                        (m) => m.MantenimientosModule
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
        ],
    },
    // {
    //     path: 'mantenimientos',
    //     loadChildren: () =>
    //         import('./mantenimientos/mantenimientos.module').then(
    //             (m) => m.MantenimientosModule
    //         ),
    // },
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    // },
    // {
    //     path: '**',
    //     redirectTo: 'dashboard',
    // },
];
