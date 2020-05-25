import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './gestion.routes';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../components/layout/layout.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), LayoutModule],
})
export class GestionModule {}
