import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleComponent } from './detalle.component';
import { routes } from './detalle.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { RouterModule } from '@angular/router';
import { BodyModule } from '@common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckMultipleModule } from '@common/check-multiple/check-multiple.module';
import { LoaderModule } from '@common/loader/loader.module';
import { DirectivesModule } from '@directives/directives.module';
import { PaginacionModule } from '@common/paginacion/paginacion.module';

@NgModule({
    declarations: [DetalleComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SelectDefaultModule,
        BodyModule,
        ReactiveFormsModule,
        CheckMultipleModule,
        LoaderModule,
        DirectivesModule,
        PaginacionModule,
    ],
})
export class DetalleModule {}
