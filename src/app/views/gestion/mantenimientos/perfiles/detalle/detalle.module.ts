import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleComponent } from './detalle.component';
import { routes } from './detalle.routes';
import { RouterModule } from '@angular/router';
import { BodyModule } from '@common/body/body.module';
import { AcordionModule } from '@common/accordion/accordion.module';
import { TreeviewModule } from 'ngx-treeview';
import { LoaderModule } from '@common/loader/loader.module';
@NgModule({
    declarations: [DetalleComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, AcordionModule, TreeviewModule.forRoot(), LoaderModule],
})
export class DetalleModule {}
