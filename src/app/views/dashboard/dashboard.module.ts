import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routes';
import { LayoutModule } from '../../components/layout/layout.module';
import { BodyModule } from '@common/body/body.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutes, LayoutModule, BodyModule],
})
export class DashboardModule {}
