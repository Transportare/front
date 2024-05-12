import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuiasDeSalidaComponent } from './guias-de-salida.component';
import { RouterModule } from '@angular/router';
import { routes } from './guias-de-salida.routes';
import { BodyModule } from '../../../../components/common/body/body.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { LoaderModule } from '@common/loader/loader.module';

@NgModule({
  declarations: [GuiasDeSalidaComponent],
  imports: [CommonModule, RouterModule.forChild(routes), BodyModule, SelectDefaultModule, ReactiveFormsModule, LoaderModule],
})
export class GuiasDeSalidaModule {}
