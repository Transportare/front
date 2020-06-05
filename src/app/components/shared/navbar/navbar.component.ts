import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(private loginService: LoginService, private router: Router) {}

    ngOnInit() {}

    logOut() {
        this.loginService.logOut();
        this.router.navigate(['/login']);
    }
}
