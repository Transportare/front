import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes.component';
import { ClientesRoutes } from './clientes.routes';
import { SelectDefaultModule } from '@common/select-default/select-default.module';
import { BodyModule } from '@common/body/body.module';

@NgModule({
    declarations: [ClientesComponent],
    imports: [CommonModule, ClientesRoutes, SelectDefaultModule, BodyModule],
})
export class ClientesModule {}
