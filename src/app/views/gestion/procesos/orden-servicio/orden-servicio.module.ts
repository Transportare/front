import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenServicioComponent } from './orden-servicio.component';
import { routes } from './orden-servicio.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@common/loader/loader.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDefaultModule } from '../../../../components/common/select-default/select-default.module';
import { PaginacionModule } from '@common/paginacion/paginacion.module';

@NgModule({
    declarations: [OrdenServicioComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BodyModule,
        DirectivesModule,
        LoaderModule,
        ReactiveFormsModule,
        SelectDefaultModule,
        PaginacionModule,
    ],
})
export class OrdenServicioModule {}
