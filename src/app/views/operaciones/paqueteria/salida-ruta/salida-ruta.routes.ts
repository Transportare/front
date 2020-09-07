import { Routes } from '@angular/router';
import { SalidaRutaComponent } from './salida-ruta.component';

export const routes: Routes = [
    {
        path: '',
        component: SalidaRutaComponent,
    },

    {
        path: `:id/cargos`,
        loadChildren: () => import('./cargos/cargos.module').then((m) => m.CargosModule),
    },
];
