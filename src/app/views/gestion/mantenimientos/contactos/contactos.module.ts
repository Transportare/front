import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactosComponent } from './contactos.component';
import { ContactosRoutes } from './contactos.routes';

@NgModule({
    declarations: [ContactosComponent],
    imports: [CommonModule, ContactosRoutes],
})
export class ContactosModule {}
