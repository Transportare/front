import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalidaRutaComponent } from './salida-ruta.component';
import { RouterModule } from '@angular/router';
import { routes } from './salida-ruta.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { BodyModule } from '@common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@common/loader/loader.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
    declarations: [SalidaRutaComponent],
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
export class SalidaRutaModule {}
