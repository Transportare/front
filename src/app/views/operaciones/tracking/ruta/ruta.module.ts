import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaComponent } from './ruta.component';
import { RouterModule } from '@angular/router';
import { routes } from './ruta.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { LoaderModule } from '@common/loader/loader.module';

@NgModule({
    declarations: [RutaComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, DirectivesModule, LoaderModule],
})
export class RutaModule {}
