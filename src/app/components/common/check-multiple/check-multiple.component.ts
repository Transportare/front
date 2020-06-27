import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-check-multiple',
    templateUrl: './check-multiple.component.html',
    styleUrls: ['./check-multiple.component.scss'],
})
export class CheckMultipleComponent implements OnInit {
    activos: any[] = [];
    @Input() data: any[] = [];
    @Output() changeData: EventEmitter<any[]> = new EventEmitter();
    constructor() {}

    ngOnInit(): void {}

    onCheckboxChange(e) {
        if (e.target.checked) {
            this.activos.push(e.target.value);
            this.changeData.emit(this.activos);
        } else {
            this.activos.forEach((item, index) => {
                if (item === e.target.value) {
                    this.activos.splice(index, 1);
                    this.changeData.emit(this.activos);
                    return;
                }
            });
        }
    }
}
