import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routes';
import { LayoutModule } from '../../components/layout/layout.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutes, LayoutModule],
})
export class DashboardModule {}
