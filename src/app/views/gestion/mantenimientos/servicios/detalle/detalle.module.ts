import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleComponent } from './detalle.component';
import { routes } from './detalle.routes';
import { RouterModule } from '@angular/router';
import { BodyModule } from '@common/body/body.module';
import { AcordionModule } from '@common/accordion/accordion.module';

@NgModule({
    declarations: [DetalleComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, AcordionModule],
})
export class DetalleModule {}
