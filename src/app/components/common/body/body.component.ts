import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit {
    @Input() header: boolean;
    @Input() body: boolean;
    @Input() bodyCard: boolean;

    constructor() {
        this.body = true;
        this.bodyCard = false;
    }

    ngOnInit(): void {}
}
