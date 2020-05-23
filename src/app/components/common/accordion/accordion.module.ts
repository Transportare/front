import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcordionComponent } from './accordion.component';
import { AcordionContainerComponent } from './accordion-container/accordion-container.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AcordionComponent, AcordionContainerComponent],
    exports: [AcordionComponent, AcordionContainerComponent],
})
export class AcordionModule {}
