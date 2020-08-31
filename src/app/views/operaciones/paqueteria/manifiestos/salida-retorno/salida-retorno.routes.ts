import { Routes } from '@angular/router';
import { SalidasRetornoComponent } from './salida-retorno.component';
import { RUTAS_OPERACIONES_PAQUETERIA } from '@routes/rutas-operaciones';
const route = RUTAS_OPERACIONES_PAQUETERIA;

export const routes: Routes = [
    {
        path: '',
        component: SalidasRetornoComponent,
    },
];
