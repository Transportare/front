import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit {
    @Input() header: boolean;
    @Input() body: boolean;
    @Input() titulo: string;
    @Input() bodyCard: boolean;

    constructor() {
        this.body = true;
        this.header = false;
        this.bodyCard = false;
    }

    ngOnInit(): void {}
}
