import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescargoMasivoComponent } from './descargo-masivo.component';
import { RouterModule } from '@angular/router';
import { routes } from './descargo-masivo.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { BodyModule } from '@common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@common/loader/loader.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
    declarations: [DescargoMasivoComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SelectDefaultModule,
        BodyModule,
        ReactiveFormsModule,
        LoaderModule,
        DirectivesModule,
    ],
})
export class DescargoMasivoModule {}
