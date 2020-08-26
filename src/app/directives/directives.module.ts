import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { EnteroPositivoDirective } from './entero-positivo.directive';
import { DropFilesDirective } from './drop-files.directive';
import { NumeroDecimalDirective } from './numero-decimal.directive';

@NgModule({
    declarations: [TooltipDirective, EnteroPositivoDirective, DropFilesDirective, NumeroDecimalDirective],
    imports: [CommonModule],
    exports: [TooltipDirective, EnteroPositivoDirective, DropFilesDirective, NumeroDecimalDirective],
})
export class DirectivesModule {}
