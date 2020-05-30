import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import { routes } from './personal.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [PersonalComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, DirectivesModule],
})
export class PersonalModule {}
