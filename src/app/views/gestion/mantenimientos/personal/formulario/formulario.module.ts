import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario.component';
import { routes } from './formulario.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { RouterModule } from '@angular/router';
import { BodyModule } from '@common/body/body.module';

@NgModule({
    declarations: [FormularioComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SelectDefaultModule, BodyModule],
})
export class FormularioModule {}