import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { EnteroPositivoDirective } from './entero-positivo.directive';

@NgModule({
    declarations: [TooltipDirective, EnteroPositivoDirective],
    imports: [CommonModule],
    exports: [TooltipDirective, EnteroPositivoDirective],
})
export class DirectivesModule {}
