import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { EnteroPositivoDirective } from './entero-positivo.directive';
import { DropFilesDirective } from './drop-files.directive';

@NgModule({
    declarations: [TooltipDirective, EnteroPositivoDirective, DropFilesDirective],
    imports: [CommonModule],
    exports: [TooltipDirective, EnteroPositivoDirective, DropFilesDirective],
})
export class DirectivesModule {}
