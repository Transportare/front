import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@services/login/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formLogin: FormGroup;
    error: boolean;

    constructor(private fb: FormBuilder, private route: Router, private loginService: LoginService) {}

    ngOnInit(): void {
        this.error = false;
        this.initForm();
    }

    initForm() {
        this.formLogin = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required]],
        });
    }

    get ussernameValid() {
        return this.formLogin.get('username').invalid && this.formLogin.get('username').touched;
    }

    get passwordValid() {
        return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
    }

    ingresar() {
        if (this.formLogin.invalid) {
            return;
        }

        const data = {
            usuario: this.formLogin.value.username,
            password: this.formLogin.value.password,
        };

        this.loginService.logIng(data).subscribe(
            (response) => {
                this.loginService.saveDataUser(response);
                this.route.navigate(['/dashboard']);
            },
            (error) => {}
        );
    }
}
