import { Component, OnInit } from '@angular/core';
import { SidebarService } from '@services/sidebar/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    menu: any;
    constructor(private sidebarService: SidebarService) {
        this.initData();
    }

    ngOnInit() {}

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
                        submenu: [
                            // {
                            //     titulo: 'Clientes',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                            // {
                            //     titulo: 'Contactos',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                            // {
                            //     titulo: 'Servicios',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                        ],
                    },
                    {
                        titulo: 'Consultas',
                        icon: 'mdi mdi-gauge',
                        url: null,
                        submenu: [
                            // {
                            //     titulo: 'Clientes',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                            // {
                            //     titulo: 'Contactos',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                            // {
                            //     titulo: 'Servicios',
                            //     icon: 'mdi mdi-gauge',
                            //     url: '',
                            // },
                        ],
                    },
                ],
            },
        ];
    }
}
