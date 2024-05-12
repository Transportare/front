import { Component, OnInit } from '@angular/core';
declare function init_plugins();

@Component({
    selector: 'app-views',
    templateUrl: './views.component.html',
    styleUrls: ['./views.component.scss'],
})
export class ViewComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        init_plugins();
    }
}
