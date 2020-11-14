import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaDatosComponent } from './carga-datos.component';
import { routes } from './carga-datos.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@common/loader/loader.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginacionModule } from '@common/paginacion/paginacion.module';
import { SelectDefaultModule } from '@common/select-default/select-default.module';

@NgModule({
    declarations: [CargaDatosComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BodyModule,
        DirectivesModule,
        LoaderModule,
        ReactiveFormsModule,
        SelectDefaultModule,
    ],
})
export class CargaDatosModule {}
