import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './views.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { routes } from './views.routes';

@NgModule({
    declarations: [ViewComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
    exports: [ViewComponent],
})
export class ViewModule {}
