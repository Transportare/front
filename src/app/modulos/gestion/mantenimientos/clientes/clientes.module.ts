import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes.component';
import { routes } from './clientes.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { BodyModule } from '@common/body/body.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ClientesComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SelectDefaultModule, BodyModule],
})
export class ClientesModule {}
