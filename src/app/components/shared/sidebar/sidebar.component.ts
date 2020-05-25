import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { SidebarService } from '@services/sidebar/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @ViewChild('menuTransportare', { static: true }) menuTransportare: ElementRef;
    menu: any;
    ruta: string;
    constructor(private sidebarService: SidebarService, private router: Router) {
        this.initData();
        this.ruta = '';
        this.router.events.subscribe((response: NavigationEnd) => {
            if (response.url) {
                const arrayRuta = response.url.split('/');
                this.ruta = arrayRuta[2];
                // console.log(arrayRuta);
            }
        });
    }

    ngOnInit() {
        // const sidebar = document.querySelector('#accordionSidebar');
        // sidebar.querySelectorAll('li').forEach((li) => console.log(li));
    }

    ngAfterViewInit(): void {
        // const lista = this.menuTransportare.nativeElement.querySelectorAll('li.nav-item');
        // lista.forEach((li) => {
        //     if (li.classList.contains('active')) {
        //         if (li.children[1]) {
        //             li.children[1].classList.add('show');
        //         }
        //     }
        // // });
        // const sidebar = document.querySelector('#accordionSidebar');
        // sidebar.querySelectorAll('.nav-item').forEach((li) => console.log(li.classList.value));
        // this.menuTransportare.nativeElement.querySelectorAll('.nav-item').forEach((li) => {
        //     console.log(li.classList);
        //     if (li.classList.contains('active')) {
        //         // if (li.children[1]) {
        //         //     li.children[1].classList.add('show');
        //         // }
        //         console.log(li);
        //     }
        // });
    }

    ngAfterViewChecked(): void {
        // this.menuTransportare.nativeElement.querySelectorAll('.nav-item').forEach((li) => {
        //     if (li.classList.contains('active')) {
        //         if (li.children[1]) {
        //             li.children[1].classList.add('show');
        //         }
        //         // console.log(li);
        //     }
        // });
    }

    initData() {
        this.menu = [
            {
                titulo: 'Modulo de gestión',
                icon: '',
                items: [
                    {
                        titulo: 'Mantenimientos',
                        icon: 'mdi mdi-gauge',
                        url: null,
                        submenu: [
                            {
                                titulo: 'Clientes',
                                icon: 'mdi mdi-gauge',
                                url: '/gestion/mantenimientos/clientes',
                            },
                            {
                                titulo: 'Contactos',
                                icon: 'mdi mdi-gauge',
                                url: '/gestion/mantenimientos/contactos',
                            },
                            {
                                titulo: 'Servicios',
                                icon: 'mdi mdi-gauge',
                                url: '/gestion/mantenimientos/servicios',
                            },
                        ],
                    },
                    {
                        titulo: 'Procesos',
                        icon: 'mdi mdi-wrench',
                        url: null,
                        submenu: [
                            {
                                titulo: 'Clientes',
                                icon: 'mdi mdi-gauge',
                                url: '/operaciones/mantenimientos/clientes',
                            },
                            {
                                titulo: 'Contactos',
                                icon: 'mdi mdi-gauge',
                                url: '/operaciones/mantenimientos/contactos',
                            },
                            {
                                titulo: 'Servicios',
                                icon: 'mdi mdi-gauge',
                                url: '/operaciones/mantenimientos/servicios',
                            },
                        ],
                    },
                ],
            },
            {
                titulo: 'Modulo de Operaciones',
                icon: '',
                items: [
                    {
                        titulo: 'Despachos',
                        icon: 'mdi mdi-gauge',
                        url: null,
                        submenu: [],
                    },
                    {
                        titulo: 'Consultas',
                        icon: 'mdi mdi-gauge',
                        url: null,
                        submenu: [],
                    },
                ],
            },
        ];
    }
}
