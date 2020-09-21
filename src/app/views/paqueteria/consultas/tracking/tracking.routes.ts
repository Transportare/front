import { Routes } from '@angular/router';
import { TrackingComponent } from './tracking.component';

export const routes: Routes = [
    {
        path: '',
        component: TrackingComponent,
    },
    {
        path: ':id/detalle',
        loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetalleModule),
    },
];
