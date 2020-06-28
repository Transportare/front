import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { routes } from './usuarios.routes';
import { BodyModule } from '@common/body/body.module';
import { DirectivesModule } from '@directives/directives.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@common/loader/loader.module';

@NgModule({
    declarations: [UsuariosComponent],
    imports: [CommonModule, RouterModule.forChild(routes), BodyModule, DirectivesModule, LoaderModule],
})
export class UsuariosModule {}
