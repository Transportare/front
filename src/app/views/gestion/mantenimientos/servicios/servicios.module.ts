import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosComponent } from './servicios.component';
import { ServiciosRoutes } from './servicios.routes';

@NgModule({
    declarations: [ServiciosComponent],
    imports: [CommonModule, ServiciosRoutes],
})
export class ServiciosModule {}
