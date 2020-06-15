import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routes';
import { BodyModule } from '@common/body/body.module';
import { LoaderModule } from '@common/loader/loader.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutes, BodyModule, LoaderModule],
})
export class DashboardModule {}
