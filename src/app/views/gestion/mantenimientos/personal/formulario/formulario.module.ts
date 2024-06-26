import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario.component';
import { routes } from './formulario.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { RouterModule } from '@angular/router';
import { BodyModule } from '@common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckMultipleModule } from '@common/check-multiple/check-multiple.module';
import { LoaderModule } from '@common/loader/loader.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
    declarations: [FormularioComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SelectDefaultModule,
        BodyModule,
        ReactiveFormsModule,
        CheckMultipleModule,
        LoaderModule,
        DirectivesModule,
    ],
})
export class FormularioModule {}
