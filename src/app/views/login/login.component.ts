import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formLogin: FormGroup;

    constructor(private fb: FormBuilder, private route: Router) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.formLogin = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required]],
        });
    }

    ingresar() {
        this.route.navigate(['/dashboard']);
    }
}
