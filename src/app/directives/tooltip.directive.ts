import { Directive, ElementRef, OnDestroy, Input, HostListener } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[DirectiveTooltip]',
})
export class TooltipDirective implements OnDestroy {
    @Input()
    public DirectiveTooltip: string;

    constructor(private elementRef: ElementRef) {}

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        const nativeElement = this.elementRef.nativeElement;
        $(nativeElement).tooltip('show');
    }

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        const nativeElement = this.elementRef.nativeElement;
        $(nativeElement).tooltip('dispose');
    }

    ngOnDestroy(): void {
        const nativeElement = this.elementRef.nativeElement;
        $(nativeElement).tooltip('dispose');
    }
}
