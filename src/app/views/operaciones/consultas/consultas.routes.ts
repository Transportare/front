import { Routes } from '@angular/router';
import { PerfilGuard } from '@guards/perfil.guard';

export const routes: Routes = [
    {
        canActivate: [PerfilGuard],
        canActivateChild: [PerfilGuard],
        path: 'seguimiento',
        loadChildren: () => import('./seguimiento/seguimiento.module').then((m) => m.SeguimientoModule),
        data: { roleId: [41] },
    },
    {
      canActivate: [PerfilGuard],
      canActivateChild: [PerfilGuard],
        path: 'guia-salidas',
        loadChildren: () => import('./guias-de-salida/guias-de-salida.module').then((m) => m.GuiasDeSalidaModule),
        data: { roleId: [42] },
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
