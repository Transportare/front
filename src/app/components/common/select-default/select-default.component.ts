import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'select-default',
    templateUrl: './select-default.component.html',
    styleUrls: ['./select-default.component.scss'],
})
export class SelectDefaultComponent implements OnInit, AfterViewInit {
    @ViewChild('inputSelect', { static: true }) inputSelect: ElementRef;
    @ViewChild('inputSelectDiv', { static: true }) inputSelectDiv: ElementRef;
    @Input() data: any[];
    @Input() selected: Item;
    @Input() search: boolean;
    @Input() placeholder: string;
    @Output() selectChange = new EventEmitter<Item>();
    dataFinal: Item[];
    showOption: boolean;
    readonly: boolean;
    constructor() {
        this.dataFinal = [];
        this.placeholder = '';
        this.readonly = false;
        this.selected = { id: 0, text: '' };
        this.showOption = false;
        this.search = true;
    }

    ngOnInit(): void {
        this.searchData('');
    }

    ngAfterViewInit() {
        document.addEventListener('click', (event: any) => {
            let padreInput = false;
            let padreOutput = false;
            if (event.path[1].parentElement != null && event.path[1].parentElement.nodeName === 'SELECT-DEFAULT') {
                padreInput = true;
            }
            if (event.path[2].parentElement != null && event.path[2].parentElement.nodeName === 'SELECT-DEFAULT') {
                padreOutput = true;
            }
            if (!padreInput && !padreOutput) {
                this.hideOptions();
                this.readonly = true;
            }
        });
        this.inputSelectDiv.nativeElement.onclick = (event) => {
            this.hideOptions();
            this.showOptions();
            setTimeout(() => {
                this.inputSelect.nativeElement.focus();
                this.searchData(this.inputSelect.nativeElement.value);
            }, 1);
        };
        if (this.search) {
            this.inputSelect.nativeElement.onkeyup = () => {
                this.searchData(this.inputSelect.nativeElement.value);
            };
        }
    }

    showOptions() {
        const padre = this.inputSelect.nativeElement.parentElement;
        padre.classList.add('activo');
        this.showOption = true;
    }

    hideOptions() {
        const totalSelects = document.getElementsByTagName('SELECT-DEFAULT').length;
        for (let i = 0; i < totalSelects; i++) {
            const select = document.getElementsByTagName('SELECT-DEFAULT')[i].querySelector('.select-default');
            select.classList.remove('activo');
        }
        this.showOption = false;
    }

    closeSelect() {
        if (this.showOption) {
            this.hideOptions();
        } else {
            this.showOptions();
            setTimeout(() => {
                this.inputSelect.nativeElement.focus();
                this.searchData(this.inputSelect.nativeElement.value);
            }, 1);
        }
    }

    selectOption(data: Item) {
        this.selected = data;
        this.selectChange.emit(data);
        this.hideOptions();
    }

    searchData(text) {
        this.dataFinal = [];
        this.data.forEach((value) => {
            if (String(value.text).toUpperCase().indexOf(text.toUpperCase()) > -1) {
                this.dataFinal.push(value);
            }
        });
    }
}

interface Item {
    id: number;
    text: string;
}
