import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilesComponent } from './perfiles.component';
import { routes } from './perfiles.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@common/loader/loader.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDefaultModule } from '../../../../components/common/select-default/select-default.module';

@NgModule({
    declarations: [PerfilesComponent],
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
export class PerfilesModule {}
