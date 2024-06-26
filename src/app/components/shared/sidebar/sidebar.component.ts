import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SidebarService } from '@services/sidebar/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    @ViewChild('menuTransportare', { static: true }) menuTransportare: ElementRef;
    menu: any;
    ruta1: string;
    ruta2: string;
    suscriber: Subscription;
    constructor(private sidebarService: SidebarService, private router: Router) {
        this.ruta1 = '';
        this.ruta2 = '';
        this.menu = [];
        this.suscriber = this.router.events.subscribe((response: NavigationEnd) => {
            if (response.url) {
                const arrayRuta = response.url.split('/');
                this.ruta1 = arrayRuta[1];
                this.ruta2 = arrayRuta[2];
            }
        });
        this.sidebarService.listarMenu().subscribe((response: any) => {
            this.menu = response.menu;
            // console.log(this.menu);
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        if (this.suscriber) {
            this.suscriber.unsubscribe();
        }
    }
}
