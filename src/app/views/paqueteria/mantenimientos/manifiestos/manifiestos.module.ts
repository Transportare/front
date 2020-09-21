import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManifiestosComponent } from './manifiestos.component';
import { RouterModule } from '@angular/router';
import { routes } from './manifiestos.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { LoaderModule } from '@common/loader/loader.module';
import { PaginacionModule } from '@common/paginacion/paginacion.module';

@NgModule({
    declarations: [ManifiestosComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, DirectivesModule, LoaderModule, PaginacionModule],
})
export class ManifiestosModule {}
