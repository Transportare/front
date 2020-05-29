import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosComponent } from './servicios.component';
import { routes } from './servicios.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ServiciosComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, DirectivesModule],
})
export class ServiciosModule {}
