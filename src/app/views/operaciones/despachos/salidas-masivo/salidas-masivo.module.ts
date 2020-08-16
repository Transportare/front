import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalidasMasivoComponent } from './salidas-masivo.component';
import { RouterModule } from '@angular/router';
import { routes } from './salidas-masivo.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { BodyModule } from '@common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@common/loader/loader.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
    declarations: [SalidasMasivoComponent],
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
export class SalidasMasivoModule {}
