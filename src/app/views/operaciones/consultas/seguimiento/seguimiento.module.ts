import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManifiestosComponent } from './seguimiento.component';
import { RouterModule } from '@angular/router';
import { routes } from './seguimiento.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { LoaderModule } from '@common/loader/loader.module';
import { PaginacionModule } from '@common/paginacion/paginacion.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ManifiestosComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BodyModule,
        DirectivesModule,
        LoaderModule,
        PaginacionModule,
        ReactiveFormsModule,
    ],
})
export class SeguimientoModule {}
